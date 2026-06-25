export const onlyDigit = new RegExp("^\\d+$");
export const emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
const regex = /^(?=.*(?:http|https|\/\/|:|\s)).*$/;
export const checkWebCondition = (string: string) => {
  return regex.test(string);
};
export const registerPasswordRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,}$)"
);
export const passwordRegex = (password: string) => {
  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;
  return regex.test(password);
};
export const basicContactNumberValidator = (identity: string) => {
  let mobileNumRegex = new RegExp("^(0)[0-9]{9}$|^(07)[0-9]{8}$");
  return mobileNumRegex.test(identity);
};

export const desMaxLimit = 2500;

export const validateInputs = (
  inputValue: string,
  validationTopics: string[]
) => {
  const validationFunctions = {
    isEmail: (value: string) =>
      !/^[a-zA-Z0-9@.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),

    isContactNo: (value: string) => {
      // Ensure input is not empty
      if (!value) return true;

      // General international phone number validation
      return !/^\+?[1-9]\d{0,3}[1-9]\d{7,14}$/.test(value);
    },
    // isContactNo: (value: string) =>
    //   !/^(011|036|031|033|038|034|054|081|051|052|066|091|041|047|032|037|021|023|024|063|067|065|026|025|027|055|057|045|035|070|071|072|074|075|076|077|078)[0-9]{7}$/.test(
    //     value
    //   ),
    isNIC: (value: string) => !/^([0-9]{10}[Vv])$|^([0-9]{12})$/.test(value),
    isValidName: (value: string) => !/^[a-zA-Z\s]+$/.test(value),
    isPasswordValid: (value: string) => {
      // Check for minimum length (6), maximum length (50)
      if (value.length < 6 || value.length > 50) return true;

      // Must contain at least one uppercase letter
      if (!/[A-Z]/.test(value)) return true;

      // Must contain at least one number
      if (!/[0-9]/.test(value)) return true;

      return false; // No error
    },
  };

  // Define error messages for each topic
  const errorMessages = {
    isEmail: "Please enter a valid email address",
    isContactNo: "Please enter a valid contact number",
    isNIC: "Please enter a valid NIC number",
    isValidName: "Please enter a valid name",
    isPasswordValid: "Password must be 6–50 characters, include at least one uppercase letter and one number",

  };

  for (const topic of validationTopics) {
    const validationFunction = validationFunctions[topic];
    const errorMessage = errorMessages[topic];
    if (validationFunction && validationFunction(inputValue)) {
      return { errorMessage, isValid: false };
    }
  }

  return { errorMessage: null, isValid: true };
};
