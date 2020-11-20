 export class CheckPattern{
    errorPattern: any;
    errorPatternMsg: string;

    passwordPattern: any;
    emailPatternError: any;
    emailPatternErrorMsg: string;

    constructor() {
        this.errorPattern = /^[^<>/=;]+$/;
        this.passwordPattern =
      "(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$";
        
        //testing for beginning white space
        // this.errorPattern = /^[^ ][\w\W ]*[^ ]/;
        this.errorPatternMsg='The operators < > / = ; cannot be used';

        this.emailPatternError = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
        this.emailPatternErrorMsg = "Email Should be of format 'example@mail.com'";
    }
     
}