import { useState } from "react";
import { Input, Select, Modal, Form } from "antd";

export function UpdateBug({ updateBug, bug, labels }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBug, setNewBug] = useState(bug);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewBug({
      title: "",
      description: "",
      severity: "",
      labels: [],
    });
  };

  const handleSubmit = () => {
    if (!bug.title || !bug.description || !bug.severity) {
      return;
    }
    updateBug(bug);
    handleCancel();
  };

  return (
    <>
      <button className="add-btn" onClick={showModal}>
        Add Bug ⛐
      </button>
      <Modal
        title="Add Bug"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form>
          <Input
            type="Add a bug"
            placeholder="Title"
            value={bug.title}
            onChange={(e) => setNewBug({ ...newBug, title: e.target.value })}
            required
            rules={[{ required: true, message: "Please enter a title" }]}
            style={{ marginBottom: 10 }}
          />
          <Input
            type="text"
            placeholder="Description"
            value={bug.description}
            onChange={(e) =>
              setNewBug({ ...newBug, description: e.target.value })
            }
            required
            rules={[{ required: true, message: "Please enter a description" }]}
            style={{ marginBottom: 10 }}
          />
          <Input
            type="number"
            placeholder="Severity"
            value={bug.severity}
            onChange={(e) => setNewBug({ ...newBug, severity: e.target.value })}
            required
            rules={[{ required: true, message: "Please enter a severity" }]}
            style={{ marginBottom: 10 }}
          />
          <Select
            mode="multiple"
            style={{ width: 200 }}
            placeholder="Filter by label..."
            onChange={(e) => setNewBug({ ...newBug, labels: e })}
            allowClear={true}
            options={labels.map((label) => ({
              value: label.id,
              label: label.title,
            }))}
          />
          <button onClick={handleSubmit}>Add Bug</button>
        </Form>
      </Modal>
    </>
  );
}
