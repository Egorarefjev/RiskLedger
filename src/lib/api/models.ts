export interface ImdgRecord {
    id: number;
    uuid: string;
    unid: string;      // "1994", "0004", ...
    name: string;      // "ЖЕЛЕЗА ПЕНТАКАРБОНИЛ\nIRON PENTACARBONYL"
    createdAt: string; // ISO
    updatedAt: string; // ISO

    [key: `col${number}`]: string | undefined;
    [key: string]: unknown;
}


