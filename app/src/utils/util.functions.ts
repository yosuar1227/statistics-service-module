/**
 * Valida una fecha con formato "DD-MM-YYYY".
 *
 * Esta función verifica:
 * 1. Que el texto cumpla el formato exacto con dos dígitos para día y mes.
 * 2. Que el día, mes y año formen una fecha real del calendario.
 *
 * @param dateStr - Cadena con la fecha a validar.
 * @returns true si la fecha es válida y existe; false en caso contrario.
 */
export function isValidDate(dateStr: string): boolean {
    // 1) Validar formato con regex
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(dateStr)) return false;

    // 2) Separar partes
    const [dayStr, monthStr, yearStr] = dateStr.split("-");
    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);

    // Mes válido
    if (month < 1 || month > 12) return false;

    // Día válido según el mes
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > lastDayOfMonth) return false;

    return true;
}
