const gradePoints = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  F: 0,
};

const subjectList = document.getElementById("subject-list");
const subjectRowTemplate = document.getElementById("subject-row-template");
const addSubjectButton = document.getElementById("add-subject-btn");
const calculateCgpaButton = document.getElementById("calculate-cgpa-btn");
const cgpaResult = document.getElementById("cgpa-result");

const percentageForm = document.getElementById("percentage-form");
const obtainedMarksInput = document.getElementById("obtained-marks");
const totalMarksInput = document.getElementById("total-marks");
const percentageResult = document.getElementById("percentage-result");

const passFailForm = document.getElementById("passfail-form");
const studentScoreInput = document.getElementById("student-score");
const passingScoreInput = document.getElementById("passing-score");
const passFailResult = document.getElementById("passfail-result");

const ageForm = document.getElementById("age-form");
const dateOfBirthInput = document.getElementById("date-of-birth");
const ageResult = document.getElementById("age-result");

const emiForm = document.getElementById("emi-form");
const loanAmountInput = document.getElementById("loan-amount");
const interestRateInput = document.getElementById("interest-rate");
const loanTimeInput = document.getElementById("loan-time");
const loanTimeUnitInput = document.getElementById("loan-time-unit");
const emiResult = document.getElementById("emi-result");

const discountForm = document.getElementById("discount-form");
const originalPriceInput = document.getElementById("original-price");
const discountPercentInput = document.getElementById("discount-percent");
const discountResult = document.getElementById("discount-result");

function setResult(target, message, tone) {
  target.textContent = message;
  target.className = "result-box";

  if (tone) {
    target.classList.add(tone);
  }
}

function createSubjectRow() {
  const fragment = subjectRowTemplate.content.cloneNode(true);
  const row = fragment.querySelector(".subject-row");
  const removeButton = row.querySelector(".remove-subject-btn");

  removeButton.addEventListener("click", () => {
    row.remove();

    if (!subjectList.children.length) {
      addSubjectRow();
      setResult(cgpaResult, "At least one subject row is kept ready for you.", "warning");
    }
  });

  return fragment;
}

function addSubjectRow() {
  subjectList.appendChild(createSubjectRow());
}

function parsePositiveNumber(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : NaN;
}

function calculateCgpa() {
  const rows = [...subjectList.querySelectorAll(".subject-row")];

  if (!rows.length) {
    setResult(cgpaResult, "Please add at least one subject.", "error");
    return;
  }

  let weightedSum = 0;
  let totalCredits = 0;

  for (const row of rows) {
    const subjectName = row.querySelector(".subject-name").value.trim();
    const creditValue = row.querySelector(".subject-credit").value.trim();
    const gradeValue = row.querySelector(".subject-grade").value;
    const credits = parsePositiveNumber(creditValue);

    if (!subjectName) {
      setResult(cgpaResult, "Each subject row needs a subject name.", "error");
      return;
    }

    if (!Number.isFinite(credits) || credits <= 0) {
      setResult(cgpaResult, `Enter valid credits for ${subjectName || "every subject"}.`, "error");
      return;
    }

    if (!(gradeValue in gradePoints)) {
      setResult(cgpaResult, `Select a valid grade for ${subjectName}.`, "error");
      return;
    }

    weightedSum += credits * gradePoints[gradeValue];
    totalCredits += credits;
  }

  if (totalCredits <= 0) {
    setResult(cgpaResult, "Total credits must be greater than zero.", "error");
    return;
  }

  const cgpa = (weightedSum / totalCredits).toFixed(2);
  setResult(cgpaResult, `Your CGPA is ${cgpa} based on ${totalCredits.toFixed(1)} total credits.`, "success");
}

function calculatePercentage(event) {
  event.preventDefault();

  const obtained = parsePositiveNumber(obtainedMarksInput.value.trim());
  const total = parsePositiveNumber(totalMarksInput.value.trim());

  if (!Number.isFinite(obtained) || obtained < 0) {
    setResult(percentageResult, "Enter a valid obtained marks value.", "error");
    return;
  }

  if (!Number.isFinite(total) || total <= 0) {
    setResult(percentageResult, "Total marks must be greater than zero.", "error");
    return;
  }

  if (obtained > total) {
    setResult(percentageResult, "Obtained marks cannot be greater than total marks.", "error");
    return;
  }

  const percentage = ((obtained / total) * 100).toFixed(2);
  setResult(percentageResult, `Your percentage is ${percentage}%.`, "success");
}

function predictPassFail(event) {
  event.preventDefault();

  const obtained = parsePositiveNumber(studentScoreInput.value.trim());
  const passing = parsePositiveNumber(passingScoreInput.value.trim());

  if (!Number.isFinite(obtained) || obtained < 0) {
    setResult(passFailResult, "Enter a valid obtained marks value.", "error");
    return;
  }

  if (!Number.isFinite(passing) || passing < 0) {
    setResult(passFailResult, "Enter a valid passing marks value.", "error");
    return;
  }

  const status = obtained >= passing ? "Pass" : "Fail";
  const tone = obtained >= passing ? "success" : "warning";
  setResult(passFailResult, `Result: ${status}. You scored ${obtained} and the passing mark is ${passing}.`, tone);
}

function calculateAge(event) {
  event.preventDefault();

  const dobValue = dateOfBirthInput.value;

  if (!dobValue) {
    setResult(ageResult, "Select a valid date of birth.", "error");
    return;
  }

  const today = new Date();
  const birthDate = new Date(`${dobValue}T00:00:00`);

  if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
    setResult(ageResult, "Date of birth cannot be in the future.", "error");
    return;
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += previousMonth.getDate();
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  setResult(ageResult, `Age: ${years} years, ${months} months, and ${days} days.`, "success");
}

function calculateEmi(event) {
  event.preventDefault();

  const principal = parsePositiveNumber(loanAmountInput.value.trim());
  const annualRate = parsePositiveNumber(interestRateInput.value.trim());
  const tenureValue = parsePositiveNumber(loanTimeInput.value.trim());
  const unit = loanTimeUnitInput.value;

  if (!Number.isFinite(principal) || principal <= 0) {
    setResult(emiResult, "Enter a valid loan amount greater than zero.", "error");
    return;
  }

  if (!Number.isFinite(annualRate) || annualRate < 0) {
    setResult(emiResult, "Enter a valid interest rate.", "error");
    return;
  }

  if (!Number.isFinite(tenureValue) || tenureValue <= 0) {
    setResult(emiResult, "Enter a valid loan duration greater than zero.", "error");
    return;
  }

  const totalMonths = unit === "years" ? tenureValue * 12 : tenureValue;

  if (totalMonths <= 0) {
    setResult(emiResult, "Loan duration must be greater than zero.", "error");
    return;
  }

  const monthlyRate = annualRate / 12 / 100;
  let emi = 0;

  if (monthlyRate === 0) {
    emi = principal / totalMonths;
  } else {
    const factor = (1 + monthlyRate) ** totalMonths;
    emi = (principal * monthlyRate * factor) / (factor - 1);
  }

  setResult(emiResult, `Monthly EMI: ${emi.toFixed(2)} for ${totalMonths} months.`, "success");
}

function calculateDiscount(event) {
  event.preventDefault();

  const originalPrice = parsePositiveNumber(originalPriceInput.value.trim());
  const discountPercent = parsePositiveNumber(discountPercentInput.value.trim());

  if (!Number.isFinite(originalPrice) || originalPrice < 0) {
    setResult(discountResult, "Enter a valid original price.", "error");
    return;
  }

  if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
    setResult(discountResult, "Discount percentage must be between 0 and 100.", "error");
    return;
  }

  const savedAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - savedAmount;
  setResult(
    discountResult,
    `Final price: ${finalPrice.toFixed(2)}. You save ${savedAmount.toFixed(2)}.`,
    "success",
  );
}

addSubjectButton.addEventListener("click", () => {
  addSubjectRow();
  setResult(cgpaResult, "Subject row added. Fill in the details and calculate.", "success");
});

calculateCgpaButton.addEventListener("click", calculateCgpa);
percentageForm.addEventListener("submit", calculatePercentage);
passFailForm.addEventListener("submit", predictPassFail);
ageForm.addEventListener("submit", calculateAge);
emiForm.addEventListener("submit", calculateEmi);
discountForm.addEventListener("submit", calculateDiscount);

addSubjectRow();
addSubjectRow();
