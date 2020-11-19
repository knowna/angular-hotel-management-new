 export class CheckPattern{
    errorPattern: any;
    errorPatternMsg: string;

    
    emailPatternError: any;
    emailPatternErrorMsg: string;

    constructor() {
        this.errorPattern = /^[^<>/=;]+$/;
        
        //testing for beginning white space
        // this.errorPattern = /^[^ ][\w\W ]*[^ ]/;
        this.errorPatternMsg='The operators < > / = ; cannot be used';

        this.emailPatternError = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
        this.emailPatternErrorMsg = "Email Should be of format 'example@mail.com'";
    }
     
}