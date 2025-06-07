import React, { useState, useEffect } from "react"; // # 保留：useState, useEffect
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
} from "antd"; // # 保留：message, Spin
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductPayload,
  type Product, // # 修改：從 api/products 匯入 Product 型別
} from "../../api/products"; // # 保留：正確路徑
import { getCurrentUser } from "../../utils/auth"; // # 新增：匯入 getCurrentUser

const ProductPage: React.FC = () => {
  const current = getCurrentUser(); // # 新增：取得目前 user
  const [products, setProducts] = useState<Product[]>([]); // # 保留：state 存放列表
  const [loading, setLoading] = useState(false); // # 保留：載入狀態
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form] = Form.useForm<ProductPayload>();

  useEffect(() => {
    // # 保留：一進來先撈後端資料
    (async () => {
      setLoading(true);
      try {
        setProducts(await getProducts());
      } catch {
        message.error("讀取商品列表失敗");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refresh = async () => {
    // # 保留：重整列表用
    setLoading(true);
    try {
      setProducts(await getProducts());
    } catch {
      message.error("讀取商品列表失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: Product) => {
    // # 保留：編輯
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleAdd = () => {
    // # 保留：新增
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const handleDelete = async (id: number, owner: string) => {
    // # 修改：新增 owner 參數
    const canDelete = current?.role === "admin" || current?.username === owner; // # 修改：admin 可刪所有，user 只能刪自己
    if (!canDelete) {
      message.error("沒有權限刪除此商品");
      return;
    }
    setLoading(true);
    try {
      await deleteProduct(id);
      message.success("刪除成功");
      await refresh();
    } catch {
      message.error("刪除失敗");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: ProductPayload) => {
    // # 保留：送出時呼叫
    setLoading(true);
    try {
      if (editing) {
        await updateProduct(editing.id, values);
        message.success("更新成功");
      } else {
        await createProduct(values);
        message.success("新增成功");
      }
      setOpen(false);
      await refresh();
    } catch {
      message.error(editing ? "更新失敗" : "新增失敗");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "商品編號", dataIndex: "id", key: "id" },
    { title: "名稱", dataIndex: "name", key: "name" },
    { title: "價格", dataIndex: "price", key: "price" },
    { title: "庫存", dataIndex: "stock", key: "stock" },
    { title: "建立者", dataIndex: "createdBy", key: "createdBy" }, // # 新增：顯示建立者
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Product) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            編輯
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id, record.createdBy)} // # 修改：傳入 owner
          >
            刪除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        新增商品
      </Button>

      {loading ? ( // # 保留：載入中顯示 Spin
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        title={editing ? "編輯商品" : "新增商品"}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="名稱" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="價格" name="price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="庫存" name="stock" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;
