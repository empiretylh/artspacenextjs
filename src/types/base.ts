export type Entity<T> = {
   [K in keyof T]: T[K];
} & BaseEntity;

export type BaseEntity = {
   _id: string;
   createdAt: string; // ISO date string
};

// export interface ApiErrorResponse<T> {

// status: boolean;
// statusCode: number;
// path: string;
// message: string;
// validationErrors: {
//    [K in keyof T]?: string[]; // Use T's keys dynamically for validation errors
// };

// timestamp: string;
// }

export type ApiErrorResponse<T> = {
   [K in keyof T]?: string[];
} & {
   non_field_errors?: string[];
};

export type Meta = {
   page: number;
   total: number;
   totalPages: number;
   pages: number[];
   hasNext: boolean;
   hasPrevious: boolean;
};

export type ApiResponse<T> = T;

export type ListApiResponse<T> = {
   results: T[];
   count: number;
   next: string | null;
   previous: string | null;
   current_page?: number;
   total_pages?: number;
};

export type ColumnFiltersState = {
   id: string;
   value: string | number | boolean | null;
}[];

export type SortingState = {
   id: string;
   desc: boolean;
}[];
