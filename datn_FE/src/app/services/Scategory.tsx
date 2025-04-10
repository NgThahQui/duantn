import ICate from "../models/ICategory";

// Lấy danh sách tất cả danh mục
export const getAllCategories = async () => {
    try {
        let response = await fetch("http://localhost:8989/category");
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách danh mục");

        let data = await response.json();
        return data.map((category: any) => ({
            id: category.id,
            name: category.name,
            description: category.description ?? '',
        }));
    } catch (error) {
        console.error("Lỗi:", error);
        return [];
    }
};

// Lấy danh mục theo ID
export const getCategoryById = async (id: number) => {
    try {
        let response = await fetch(`http://localhost:8989/category/${id}`);
        if (!response.ok) throw new Error("Lỗi khi lấy danh mục");

        let data = await response.json();
        return {
            id: data.id,
            name: data.name,
            description: data.description ?? '',
        };
    } catch (error) {
        console.error("Lỗi:", error);
        return null;
    }
};

// Thêm danh mục mới
export const postCategory = async (category: ICate) => {
    try {
        let response = await fetch("http://localhost:8989/category", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category),
        });

        if (!response.ok) throw new Error("Lỗi khi thêm danh mục");

        return await response.json();
    } catch (error) {
        console.error("Lỗi:", error);
        return null;
    }
};

// Cập nhật danh mục
export const putCategory = async (category: ICate) => {
    try {
        let response = await fetch(`http://localhost:8989/category/${category.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category),
        });

        if (!response.ok) throw new Error("Lỗi khi cập nhật danh mục");

        return await response.json();
    } catch (error) {
        console.error("Lỗi:", error);
        return null;
    }
};

// Xóa danh mục
export const deleteCategory = async (id: number) => {
    try {
        let response = await fetch(`http://localhost:8989/category/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error("Lỗi khi xóa danh mục");

        return true;
    } catch (error) {
        console.error("Lỗi:", error);
        return false;
    }
};
