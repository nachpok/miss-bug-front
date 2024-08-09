import { useState, useEffect } from "react";
import { Input, Select, Modal, Form } from "antd";

export function UpdateBugModal({ updateBug, bug, labels }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBug, setNewBug] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState(bug.labels || []);

  useEffect(() => {
    setNewBug({ ...bug });
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    console.log("newBug: ", newBug);
    if (!newBug.title || !newBug.description || !newBug.severity) {
      return;
    }
    updateBug({ ...bug, ...newBug, labels: selectedLabels });
    handleCancel();
  };

  const options = labels.map((label) => ({
    value: label,
    label: label,
  }));

  const defaultValue = options.filter((option) =>
    bug.labels?.includes(option.value)
  );

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
            defaultValue={defaultValue}
            options={options}
          />
          <button onClick={handleSubmit}>Update Bug</button>
        </Form>
      </Modal>
    </>
  );
}
