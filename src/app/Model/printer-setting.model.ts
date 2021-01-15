/**	
 * Defines the model for Financial entity
 */
export interface PrinterSetting {
	Id?: number;
	ShareName?: string;
	PrinterType?: number; 
    CodePage?: number; 
    CharsPerLine?: number; 
    PageHeight?: number; 
    CustomPrinterName?: string; 
	CustomPrinterData?: string;       
	DepartmentId?: number; 
}
