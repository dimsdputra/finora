import Bonus from "../assets/incomeIcon/bonus.png";
import BusinessIncome from "../assets/incomeIcon/business_income.png";
import Dividens from "../assets/incomeIcon/dividends.png";
import Freelancer from "../assets/incomeIcon/freelancer.png";
import Gifts from "../assets/incomeIcon/gift.png";
import Interest from "../assets/incomeIcon/interest.png";
import InvesmentReturn from "../assets/incomeIcon/invesment_return.png";
import Other from "../assets/incomeIcon/other.png";
import Refund from "../assets/incomeIcon/refund.png";
import Rental from "../assets/incomeIcon/rental_income.png";
import Salary from "../assets/incomeIcon/salary.png";
import Education from "../assets/expenseIcon/education.png";
import Entertaiment from "../assets/expenseIcon/entertaiment.png";
import Food from "../assets/expenseIcon/food_and_drinks.png";
import Giveaway from "../assets/expenseIcon/giveaway.png";
import HealthCare from "../assets/expenseIcon/healthcare.png";
import HouseHold from "../assets/expenseIcon/household.png";
import Insurance from "../assets/expenseIcon/health-insurance.png";
import LoanPayment from "../assets/expenseIcon/loan_payment.png";
import OtherExpense from "../assets/expenseIcon/other.png";
import Mortgage from "../assets/expenseIcon/mortgage.png";
import Shopping from "../assets/expenseIcon/online_shopping.png";
import Subscription from "../assets/expenseIcon/subscribe.png";
import Transport from "../assets/expenseIcon/transportation.png";
import Travel from "../assets/expenseIcon/travel.png";
import Utilities from "../assets/expenseIcon/utilities.png";

export const CategoriesIcons = (value: string | undefined) => {
  switch (value) {
    case "Bonus":
      return <img src={Bonus} alt={value} />;
    case "Business Income":
      return <img src={BusinessIncome} alt={value} />;
    case "Dividends":
      return <img src={Dividens} alt={value} />;
    case "Freelance":
      return <img src={Freelancer} alt={value} />;
    case "Gift Received":
      return <img src={Gifts} alt={value} />;
    case "Interest":
      return <img src={Interest} alt={value} />;
    case "Investment Return":
      return <img src={InvesmentReturn} alt={value} />;
    case "Other Income":
      return <img src={Other} alt={value} />;
    case "Refund":
      return <img src={Refund} alt={value} />;
    case "Rental Income":
      return <img src={Rental} alt={value} />;
    case "Salary":
      return <img src={Salary} alt={value} />;
    case "Education":
      return <img src={Education} alt={value} />;
    case "Entertainment":
      return <img src={Entertaiment} alt={value} />;
    case "Food \u0026 Drinks":
      return <img src={Food} alt={value} />;
    case "Gifts \u0026 Donations":
      return <img src={Giveaway} alt={value} />;
    case "Healthcare":
      return <img src={HealthCare} alt={value} />;
    case "Household":
      return <img src={HouseHold} alt={value} />;
    case "Insurance":
      return <img src={Insurance} alt={value} />;
    case "Loan Payments":
      return <img src={LoanPayment} alt={value} />;
    case "Other Expenses":
      return <img src={OtherExpense} alt={value} />;
    case "Rent/Mortgage":
      return <img src={Mortgage} alt={value} />;
    case "Shopping":
      return <img src={Shopping} alt={value} />;
    case "Subscriptions":
      return <img src={Subscription} alt={value} />;
    case "Transportation":
      return <img src={Transport} alt={value} />;
    case "Travel":
      return <img src={Travel} alt={value} />;
    case "Utilities":
      return <img src={Utilities} alt={value} />;
    default:
      return <img src={Other} alt={value} />;
  }
};
