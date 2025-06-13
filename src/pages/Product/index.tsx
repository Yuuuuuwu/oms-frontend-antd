import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Select,
} from "antd";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getCategories,
  batchSetActive,
  changeStock,
  createCategory,
  type Category,
} from "../../api/products";
import { SearchOutlined } from "@ant-design/icons";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  desc?: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0); // 新增 total 狀態
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState<number | undefined>();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      if (res && Array.isArray(res.data)) {
        setProducts(res.data);
        setTotal(typeof res.total === "number" ? res.total : res.data.length);
      } else {
        setProducts([]);
        setTotal(0);
      }
    } catch {
      message.error("取得商品失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    getCategories().then((data) => {
      if (Array.isArray(data)) {
        setCategories(data); // 確保分類資料為陣列
      } else {
        message.error("取得分類失敗");
      }
    });
  }, []);

  const handleEdit = (record: Product) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      message.success("刪除成功");
      fetchProducts();
    } catch {
      message.error("刪除失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id: number) => {
    setLoading(true);
    try {
      const product = await getProduct(id);
      Modal.info({
        title: `商品詳情 - ${product.name}`,
        content: (
          <div>
            <div>價格：{product.price}</div>
            <div>庫存：{product.stock}</div>
            <div>描述：{product.desc}</div>
            <div>啟用：{product.is_active ? "是" : "否"}</div>
            <div>
              圖片：
              {product.image_url ? (
                <img src={product.image_url} alt="img" style={{ width: 80 }} />
              ) : (
                "-"
              )}
            </div>
          </div>
        ),
      });
    } catch {
      message.error("取得商品詳情失敗");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
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
      fetchProducts();
    } catch {
      message.error(editing ? "更新失敗" : "新增失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchActive = async (is_active: boolean) => {
    if (!selectedRowKeys.length) return message.warning("請先選擇商品");
    setLoading(true);
    try {
      await batchSetActive(selectedRowKeys, is_active);
      message.success("批次操作成功");
      fetchProducts();
    } catch {
      message.error("批次操作失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStock = async (id: number, delta: number) => {
    setLoading(true);
    try {
      await changeStock(id, delta);
      message.success("庫存異動成功");
      fetchProducts();
    } catch {
      message.error("庫存異動失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      message.warning("請輸入分類名稱");
      return;
    }
    try {
      const cat = await createCategory({ name: newCategoryName });
      message.success("新增分類成功");
      setCategoryModalOpen(false);
      setNewCategoryName("");
      // 重新取得分類並選中剛新增的分類
      const cats = await getCategories();
      setCategories(cats);
      form.setFieldsValue({ category_id: cat.id });
    } catch {
      message.error("新增分類失敗");
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchName) params.name = searchName;
      if (searchCategory) params.category_id = searchCategory;
      const res = await getProducts(params);
      if (res && Array.isArray(res.data)) {
        setProducts(res.data);
        setTotal(typeof res.total === "number" ? res.total : res.data.length);
      } else {
        setProducts([]);
        setTotal(0);
      }
    } catch {
      message.error("查詢商品失敗");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "商品編號", dataIndex: "id" },
    { title: "名稱", dataIndex: "name" },
    { title: "價格", dataIndex: "price" },
    { title: "庫存", dataIndex: "stock" },
    {
      title: "啟用",
      dataIndex: "is_active",
      render: (v: boolean) => (v ? "是" : "否"),
    },
    { title: "描述", dataIndex: "desc" },
    {
      title: "圖片",
      dataIndex: "image_url",
      render: (url: string) =>
        url ? <img src={url} alt="img" style={{ width: 40 }} /> : "-",
    },
    {
      title: "操作",
      render: (_: any, record: Product) => (
        <>
          <Button type="link" onClick={() => handleView(record.id)}>
            查看
          </Button>
          <Button type="link" onClick={() => handleEdit(record)}>
            編輯
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
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
      {/* 查詢表單 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Input
          placeholder="商品名稱"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select
          allowClear
          placeholder="請選擇分類"
          value={searchCategory}
          onChange={setSearchCategory}
          style={{ width: 180 }}
        >
          {categories.map((cat) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
        >
          查詢
        </Button>
        <Button
          onClick={() => {
            setSearchName("");
            setSearchCategory(undefined);
            fetchProducts();
          }}
        >
          清除
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
      />
      <div style={{ margin: "16px 0" }}>
        <Button
          onClick={() => handleBatchActive(true)}
          disabled={!selectedRowKeys.length}
        >
          批次上架
        </Button>
        <Button
          onClick={() => handleBatchActive(false)}
          disabled={!selectedRowKeys.length}
          style={{ marginLeft: 8 }}
        >
          批次下架
        </Button>
      </div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        title={editing ? "編輯商品" : "新增商品"}
        confirmLoading={loading}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="名稱" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="價格"
            name="price"
            rules={[{ required: true, type: "number", min: 0 }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="庫存"
            name="stock"
            rules={[{ required: true, type: "number", min: 0 }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="圖片網址" name="image_url">
            <Input />
          </Form.Item>
          <Form.Item
            label="啟用"
            name="is_active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Form.Item label="促銷價" name="promo_price">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="分類" name="category_id">
            <Select
              allowClear
              placeholder="請選擇分類"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ display: "flex", padding: 8 }}>
                    <Button
                      type="link"
                      onClick={() => setCategoryModalOpen(true)}
                      style={{ padding: 0 }}
                    >
                      ＋ 新增分類
                    </Button>
                  </div>
                </>
              )}
            >
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="庫存異動">
            <Input.Group compact>
              <InputNumber
                min={-999}
                max={999}
                defaultValue={0}
                id="stock-delta"
                style={{ width: 100 }}
              />
              <Button
                onClick={() => {
                  const delta = Number(
                    (document.getElementById("stock-delta") as HTMLInputElement)
                      .value
                  );
                  if (editing) handleChangeStock(editing.id, delta);
                }}
              >
                異動
              </Button>
            </Input.Group>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={categoryModalOpen}
        onCancel={() => setCategoryModalOpen(false)}
        onOk={handleAddCategory}
        title="新增分類"
        okText="新增"
      >
        <Input
          placeholder="請輸入分類名稱"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onPressEnter={handleAddCategory}
        />
      </Modal>
    </div>
  );
};

export default ProductPage;