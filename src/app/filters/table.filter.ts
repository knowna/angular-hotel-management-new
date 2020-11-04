import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'TableFilter'
})
export class TableFilter implements PipeTransform {
    transform(TableList: any[], TableName: string): any[] {
        let filteredTables: any[] = [];

        if (!TableName) {
            return TableList;
        }

        filteredTables = TableList.filter((Category) => {
            return (Category.Name.toLowerCase().indexOf(TableName.toLowerCase()) !== -1);
        });

        return filteredTables;
    }
}