import {
  Checkbox,
  mergeStyleSets,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  TextField,
} from "@fluentui/react";
import React, { useState } from "react";
import { GroupDto, ApiClient, IGroupDto } from "../../../generated/backend";

export interface IAddGroupFormProps {
  onSuccess(group: IGroupDto): void;
}

const AddGroupForm: React.FC<IAddGroupFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const setNameField = React.useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setName(newValue || "");
    },
    []
  );

  const [isActive, setIsActive] = useState(true);
  const onIsActiveChange = React.useCallback(
    (_ev: React.FormEvent<HTMLElement>, checked: boolean) =>
      setIsActive(!!checked),
    []
  );

  const [error, setError] = useState(null);
  const hideError = () => setError(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const group = GroupDto.fromJS({ name, isActive });
    setIsLoading(true);
    await new ApiClient(process.env.REACT_APP_API_BASE)
      .groups_CreateGroup(group)
      .then(onSuccess)
      .catch((error) => {
        console.error(error);
        setError(error);
      })
      .then(() => setIsLoading(false));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add a Group</h4>
      {error && (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          dismissButtonAriaLabel="Close"
          onDismiss={hideError}
        >
          There was an error adding your group.
        </MessageBar>
      )}
      <TextField label="Name" required value={name} onChange={setNameField} />
      <Checkbox
        label="Is Active"
        checked={isActive}
        onChange={onIsActiveChange}
        className={contentStyles.checkBox}
      />
      <button className={contentStyles.submitButton} type="submit">
        {isLoading ? <Spinner size={SpinnerSize.medium} /> : "Submit"}
      </button>
    </form>
  );
};

const contentStyles = mergeStyleSets({
  submitButton: {
    width: "60px",
  },
  checkBox: {
    padding: "12px 0px 12px 0px",
  },
});

export default AddGroupForm;
