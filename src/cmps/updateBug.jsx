import { useState } from "react";
import { Input, Select, Modal, Form } from "antd";
import dayjs from "dayjs";

export function UpdateBug({ updateBug, bug, labels }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBug, setNewBug] = useState({ ...bug });
  const [selectedLabels, setSelectedLabels] = useState(bug.labels || []);

  const defaultLabels =
    labels
      .filter((label) => bug.labelIds?.includes(label.id))
      .map((label) => ({
        value: label.id,
        label: label.title,
      })) || [];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewBug(null);
  };

  const handleSubmit = () => {
    if (!newBug.title || !newBug.description || !newBug.severity) {
      return;
    }
    updateBug({ ...bug, ...newBug, labels: selectedLabels });
    console.log("updated bug", dayjs(bug.createdAt).format("DD/MM/YYYY"));
    handleCancel();
  };

  return (
    <>
      <button onClick={showModal}>Edit</button>
      <Modal
        title="Update Bug"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form>
          <Input
            type="Add a bug"
            placeholder="Title"
            defaultValue={bug.title}
            onChange={(e) => setNewBug({ ...newBug, title: e.target.value })}
            required
            rules={[{ required: true, message: "Please enter a title" }]}
            style={{ marginBottom: 10 }}
          />
          <Input
            type="text"
            placeholder="Description"
            defaultValue={bug.description}
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
            defaultValue={bug.severity}
            onChange={(e) => setNewBug({ ...newBug, severity: e.target.value })}
            required
            rules={[{ required: true, message: "Please enter a severity" }]}
            style={{ marginBottom: 10 }}
          />
          <Select
            mode="multiple"
            style={{ width: 200 }}
            placeholder="Filter by label..."
            onChange={setSelectedLabels}
            allowClear={true}
            defaultValue={bug.labels}
            options={labels.map((label) => ({
              value: label.id,
              label: label.title,
            }))}
          />
          <button onClick={handleSubmit}>Update Bug</button>
        </Form>
      </Modal>
    </>
  );
}
