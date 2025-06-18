import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Tree, message } from "antd";
import * as ProductAPI from "../../api/products";
import type { Category } from "../../api/products";

const { getCategories, createCategory, updateCategory, deleteCategory } = ProductAPI;

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      message.error("取得分類失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = (parent?: Category) => {
    setEditing(null);
    form.resetFields();
    if (parent) form.setFieldsValue({ parent_id: parent.id });
    setOpen(true);
  };

  const handleEdit = (cat: Category) => {
    setEditing(cat);
    form.setFieldsValue(cat);
    setOpen(true);
  };

  const handleDelete = async (cat: Category) => {
    setLoading(true);
    try {
      await deleteCategory(cat.id);
      message.success("刪除成功");
      fetchCategories();
    } catch {
      message.error("刪除失敗");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (editing) {
        await updateCategory(editing.id, values);
        message.success("更新成功");
      } else {
        await createCategory(values);
        message.success("新增成功");
      }
      setOpen(false);
      fetchCategories();
    } catch {
      message.error(editing ? "更新失敗" : "新增失敗");
    } finally {
      setLoading(false);
    }
  };

  // 將分類轉為 antd Tree 結構
  const toTreeData = (cats: Category[]): any[] =>
    cats.map((c) => ({
      title: (
        <span>
          {c.name}
          <Button size="small" onClick={() => handleAdd(c)} style={{ marginLeft: 8 }}>
            新增子分類
          </Button>
          <Button size="small" onClick={() => handleEdit(c)} style={{ marginLeft: 8 }}>
            編輯
          </Button>
          <Button size="small" danger onClick={() => handleDelete(c)} style={{ marginLeft: 8 }}>
            刪除
          </Button>
        </span>
      ),
      key: c.id,
      children: c.children ? toTreeData(c.children) : [],
    }));

  return (
    <div>
      <Button type="primary" onClick={() => handleAdd()} style={{ marginBottom: 16 }}>
        新增分類
      </Button>
      <Tree treeData={toTreeData(categories)} defaultExpandAll />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        title={editing ? "編輯分類" : "新增分類"}
        confirmLoading={loading}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="分類名稱" name="name" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item label="父分類ID" name="parent_id"> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManager;
