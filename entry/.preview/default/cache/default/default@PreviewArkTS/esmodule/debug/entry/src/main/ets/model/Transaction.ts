/**
 * 交易记录数据模型 — API 24 适配
 */
export enum TransactionType {
    INCOME = "income",
    EXPENSE = "expense"
}
export class Transaction {
    id: number = 0;
    type: TransactionType = TransactionType.EXPENSE;
    amount: number = 0;
    category: string = '其他';
    note: string = '';
    created_at: string = '';
    /** 金额显示（带正负号） */
    get amountDisplay(): string {
        const prefix = this.type === TransactionType.INCOME ? '+' : '-';
        return `${prefix}¥${this.amount.toFixed(2)}`;
    }
    /** 是否为收入 */
    get isIncome(): boolean {
        return this.type === TransactionType.INCOME;
    }
}
