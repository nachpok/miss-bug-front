import { useState } from "react";
import { Input, Select, Modal, Form } from "antd";

export function AddBugModal({ addBug, labels }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bug, setBug] = useState({
    title: "",
    description: "",
    severity: "",
    labels: [],
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setBug({
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
    addBug(bug);
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
            onChange={(e) => setBug({ ...bug, title: e.target.value })}
            required
            rules={[{ required: true, message: "Please enter a title" }]}
            style={{ marginBottom: 10 }}
          />
          <Input
            type="text"
            placeholder="Description"
            value={bug.description}
            onChange={(e) => setBug({ ...bug, description: e.target.value })}
            required
            rules={[{ required: true, message: "Please enter a description" }]}
            style={{ marginBottom: 10 }}
          />
          <Input
            type="number"
            placeholder="Severity"
            value={bug.severity}
            onChange={(e) => setBug({ ...bug, severity: e.target.value })}
            required
            rules={[{ required: true, message: "Please enter a severity" }]}
            style={{ marginBottom: 10 }}
          />
          <Select
            mode="multiple"
            style={{ width: 200 }}
            placeholder="Filter by label..."
            onChange={(e) => setBug({ ...bug, labels: e })}
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
