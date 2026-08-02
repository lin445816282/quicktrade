/**
 * 数字格式化工具
 */
export class NumberUtils {
    /** 金额格式化：¥1,234.56 */
    static formatMoney(amount: number): string {
        if (amount === 0)
            return '¥0.00';
        const abs = Math.abs(amount);
        const parts = abs.toFixed(2).split('.');
        const intStr = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const sign = amount < 0 ? '-' : '';
        return `${sign}¥${intStr}.${parts[1]}`;
    }
    /** 金额简短显示：¥1.23k */
    static formatShort(amount: number): string {
        if (amount === 0)
            return '¥0';
        const abs = Math.abs(amount);
        const prefix = amount < 0 ? '-' : '';
        if (abs >= 10000)
            return `${prefix}¥${(abs / 10000).toFixed(1)}万`;
        if (abs >= 1000)
            return `${prefix}¥${(abs / 1000).toFixed(1)}k`;
        return `${prefix}¥${abs.toFixed(0)}`;
    }
    /** 百分比（保留1位小数） */
    static formatPercent(value: number): string {
        return `${(value * 100).toFixed(1)}%`;
    }
}
