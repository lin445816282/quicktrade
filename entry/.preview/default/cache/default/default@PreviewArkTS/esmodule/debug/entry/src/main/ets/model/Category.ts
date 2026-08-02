import { TransactionType } from "@bundle:com.xiaolin.quicktrade/entry/ets/model/Transaction";
export class Category {
    id: number = 0;
    name: string = '';
    icon: string = '💰';
    type: TransactionType = TransactionType.EXPENSE;
    sort_order: number = 0;
    /** 品类标签 */
    get label(): string {
        return `${this.icon} ${this.name}`;
    }
    /** 工厂方法 */
    static create(name: string, icon: string, type: TransactionType, sortOrder: number = 100): Category {
        const c = new Category();
        c.name = name;
        c.icon = icon;
        c.type = type;
        c.sort_order = sortOrder;
        return c;
    }
}
/** 预设支出品类 */
export function getDefaultExpenseCategories(): Category[] {
    return [
        Category.create('餐饮', '🍜', TransactionType.EXPENSE, 1),
        Category.create('交通', '🚗', TransactionType.EXPENSE, 2),
        Category.create('购物', '🛍️', TransactionType.EXPENSE, 3),
        Category.create('日用品', '🧴', TransactionType.EXPENSE, 4),
        Category.create('娱乐', '🎮', TransactionType.EXPENSE, 5),
        Category.create('通讯', '📱', TransactionType.EXPENSE, 6),
        Category.create('居住', '🏠', TransactionType.EXPENSE, 7),
        Category.create('医疗', '💊', TransactionType.EXPENSE, 8),
        Category.create('教育', '📚', TransactionType.EXPENSE, 9),
        Category.create('其他', '📌', TransactionType.EXPENSE, 99)
    ];
}
/** 预设收入品类 */
export function getDefaultIncomeCategories(): Category[] {
    return [
        Category.create('工资', '💵', TransactionType.INCOME, 1),
        Category.create('投资', '📈', TransactionType.INCOME, 2),
        Category.create('兼职', '💼', TransactionType.INCOME, 3),
        Category.create('退款', '↩️', TransactionType.INCOME, 4),
        Category.create('其他', '📌', TransactionType.INCOME, 99)
    ];
}
export const DEFAULT_EXPENSE_CATEGORIES = getDefaultExpenseCategories();
export const DEFAULT_INCOME_CATEGORIES = getDefaultIncomeCategories();
