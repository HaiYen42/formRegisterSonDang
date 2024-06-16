// Constructor Function
function Validator(options) {
  function validate(inputElemement, rule) {
    var errorMessage = rule.test(inputElemement.value);
    var errorElement = inputElemement.parentElement.querySelector(
      options.errorSelector
    );
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElemement.parentElement.classList.add("invalid");
      // innerText = errorMessage;
    } else {
      errorElement.innerText = "";
      inputElemement.parentElement.classList.remove("invalid");
    }
    return !errorMessage;
  }

  // Lấy element của form cần validate
  var formElement = document.querySelector(options.form);
  if (formElement) {
    // Khi sumit form
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      // Lặp qua từng rules và validate

      options.rules.forEach(function (rule) {
        var inputElemement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElemement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });
      if (isFormValid) {
        var enableInputs = formElement.querySelectorAll(
          "[name]:not([disable])"
        );
        var formValues = Array.from(enableInputs).reduce(function (
          values,
          input
        ) {
          values[input.name] = input.value;
          return values;
        },
        {});
        console.log(formValues);
      }
    };

    // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input)
    options.rules.forEach(function (rule) {
      var inputElemement = formElement.querySelector(rule.selector);

      if (inputElemement) {
        // Xử lý trường hợp blur khỏi input
        inputElemement.onblur = function () {
          validate(inputElemement, rule);
        };
        // Xử lý mỗi khi ng dùng nhập vào input
        inputElemement.oninput = function () {
          var errorElement =
            inputElemement.parentElement.querySelector(".form-message");
          errorElement.innerText = "";
          inputElemement.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}

// Định nghĩa rules
// 1. Khi có lỗi --> trả ra message lỗi
// 2. Khi ko lỗi --> undefine
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "Vui lòng nhập trường này";
    },
  };
};
Validator.minLenght = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
    },
  };
};
Validator.isConfirmPassword = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Giá trị không chính xác";
    },
  };
};
