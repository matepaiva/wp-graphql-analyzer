import { useState } from "react";
import { Alert, Button, Modal, notification, Typography } from "antd";
import { useDatabaseSave } from "../lib/db";
import textToQueriesAdapter from "../lib/textToQueriesAdapter";

const { Title } = Typography;
const message = "Data imported successfully!";

export default function ModalImportData() {
  const [isVisible, setIsVisible] = useState(false);
  const onClose = () => setIsVisible(false);
  const onOpen = () => setIsVisible(true);

  const save = useDatabaseSave();

  const [modalExportErrorMessage, setModalExportErrorMessage] = useState("");

  async function copyHandler() {
    try {
      await navigator.clipboard
        .readText()
        .then(textToQueriesAdapter)
        .then(save);

      onClose();
      notification.success({ message });
    } catch (error) {
      setModalExportErrorMessage(error.message);
      console.error(error);
    }
  }

  return (
    <>
      <Modal
        title="Import new GraphQL result"
        visible={isVisible}
        onOk={copyHandler}
        okText="Import"
        onCancel={onClose}
      >
        <Title level={3}>Instructions</Title>
        <ol>
          <li>{"Go to the wordpress dashboard > GraphQL > Settings;"}</li>
          <li>{'Check the checkbox "Enable GraphQL Query Logs"'}</li>
          <li>{'Choose the "Query Log Role"'}</li>
          <li>Make the GraphQL request you want to analyse</li>
          <li>
            Select the full (ctrl + a) response and copy it to your clipboard
            (ctrl + c)
          </li>
          <li>{'Click the button bellow "Import"'}</li>
        </ol>
        {modalExportErrorMessage && (
          <Alert
            message={
              <span>
                <strong>Error: </strong>
                {modalExportErrorMessage}
              </span>
            }
            type="error"
          />
        )}
      </Modal>
      <Button type="primary" onClick={onOpen}>
        Import new GraphQL result
      </Button>
    </>
  );
}
