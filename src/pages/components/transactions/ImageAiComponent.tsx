import { UseFormReturn } from "react-hook-form";
import { AddExpenseFormType } from "./addExpense/add-expense-utils";
import { Button } from "../../../components/ui/Button";
import useLoading from "../../../hooks/useLoading";
import { GoogleGenAI } from "@google/genai";
import { useRef, useState } from "react";

interface ImageAiComponentProps {
  form: UseFormReturn<AddExpenseFormType, any, AddExpenseFormType>;
  categoryData: CategoriesDataType[] | undefined;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ImageAiComponent = (props: ImageAiComponentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setLoading } = useLoading();
  const [error, setError] = useState<string | null>();

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else {
          resolve("");
        }
      };
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: (await base64EncodedDataPromise) as string,
        mimeType: file.type,
      },
    };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`);
        // Clear the input value to allow selecting the same file again if needed
        if (e.target) {
          e.target.value = "";
        }
        return;
      }
      setError(null); // Clear previous errors if file is valid
      try {
        setLoading(true);
        const parts = [];

        const prompt = `Can you analyze the receipt from the image?
        analysis:
          - date: the date of the receipt, e.g., "2024-01-01" or "01/01/2024" or "January 1, 2024" or "1st January 2024" or "2024-01-01T00:00:00Z" or "09-01-24" means "date-month-year" or "2024-01-09",
          - total: the total purchase,
          - category: analyze the category, whether it is "Education" or "Entertainment" or "Food \u0026 Drinks" or "Gifts \u0026 Donations" or "Healthcare" or "Household" or "Insurance" or "Loan Payments" or "Other Expenses" or "Rent/Mortgage" or "Shopping" or "Subscriptions" or "Transportation" or "Travel" or "Utilities",
          - description: match the results from the category
        
        give the results in json format:
        {
          date: analysis result date,
          amount: analysis result total,
          category: analysis result category,
          description: analysis result description
        }`;

        parts.push({ text: prompt });
        const imagePart = await fileToGenerativePart(file);
        parts.push(imagePart);

        if (parts.length === 0) {
          setError("No input provided (text or image).");
          return;
        }

        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ parts: parts }],
        });
        const response = result;

        if ((response?.candidates?.[0]?.content?.parts?.length ?? 0) > 0) {
          const contents = response?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (contents !== undefined) {
            try {
              // Try direct parse first
              let jsonResponse;
              try {
                jsonResponse = JSON.parse(contents);
              } catch {
                // Fallback: extract JSON block from text
                const match = contents.match(/\{[\s\S]*\}/);
                if (match) {
                  jsonResponse = JSON.parse(match[0]);
                } else {
                  setError("Image not recognized. Please try again.");
                  throw new Error("No JSON found in Gemini response.");
                }
              }
              if (
                !jsonResponse?.amount &&
                !jsonResponse?.date &&
                !jsonResponse?.category &&
                !jsonResponse?.description
              ) {
                setError("Image not recognized. Please try again.");
              }
              props.form.reset({
                ...jsonResponse,
                date: jsonResponse.date
                  ? new Date(jsonResponse.date)
                  : undefined,
                category: props.categoryData?.find(
                  (cat) => cat.categoryName === jsonResponse.category
                )?._id
                  ? [
                      props.categoryData?.find(
                        (cat) => cat.categoryName === jsonResponse.category
                      )?._id,
                    ]
                  : [],
              });
            } catch (err) {
              console.error(
                "Failed to parse Gemini response as JSON:",
                err,
                contents
              );
              setError("Gemini did not return valid JSON. Please try again.");
            }
          }
        } else {
          setError("No valid response from Gemini API.");
        }
      } catch (err: any) {
        console.error("Error analyzing image with Gemini API:", err);
        setError(
          `Failed to analyze image. Error: ${
            err.message || "Unknown error"
          }. Please ensure your API key is valid, the image format is supported, and you have network access.`
        );
      } finally {
        setLoading(false);
        if (e.target) e.target.value = "";
      }
    } else {
      setError(null); // Clear error if no file is selected
      e.target.value = "";
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef} // Attach the ref
        accept="image/*" // Accept all image types
        capture="user" // Hint to the browser to open the camera (or file picker if not supported)
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the actual input
      />
      <div className="flex flex-col items-center gap-2 mb-4">
        <p>AI-powered receipt analysis</p>
        <Button onClick={triggerFileInput} variant={"accent"}>
          Take Photo or Upload 📸
        </Button>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </>
  );
};

export default ImageAiComponent;
