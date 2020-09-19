import React, { useEffect, useState } from "react";
import {
  List,
  IColumn,
  Spinner,
  DetailsList,
  DetailsListLayoutMode,
  SpinnerSize,
  Modal,
  mergeStyleSets,
} from "@fluentui/react";
import { IGroupDto, ApiClient } from "../../generated/backend";
import AddGroupForm from "./addGroupForm/AddGroupForm";

const Groups: React.FC = () => {
  const [data, setData] = useState({
    groups: [] as IGroupDto[],
    isFetching: false,
  });
  const groupKeys: IGroupDto = {
    id: null,
    name: "",
    isActive: false,
    createdDate: null,
    updatedDate: null,
  };
  const columns = Object.keys(groupKeys).map(
    (key): IColumn => {
      return {
        key,
        name: key.replace(/([A-Z])/g, " $1").replace(/^./, (str: string) => {
          return str.toUpperCase();
        }),
        fieldName: key,
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      };
    }
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        setData({ groups: data.groups, isFetching: true });
        const result = await new ApiClient(
          process.env.REACT_APP_API_BASE
        ).groups_GetAllGroups();
        setData({ groups: result, isFetching: false });
      } catch (e) {
        console.log(e);
        setData({ groups: data.groups, isFetching: false });
      }
    };

    fetchData();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const hideModal = () => setIsModalOpen(false);

  const onSuccess = (group: IGroupDto) => {
    setData({
      groups: [...data.groups, group],
      isFetching: false,
    });
    hideModal();
  };

  return (
    <>
      <h2>Groups</h2>
      <button onClick={showModal}>Add Group</button>
      <Modal
        isOpen={isModalOpen}
        onDismiss={hideModal}
        containerClassName={contentStyles.container}
      >
        <AddGroupForm onSuccess={onSuccess} />
      </Modal>
      <DetailsList
        items={data.groups.map((group) => {
          return {
            ...group,
            createdDate: group.createdDate.toLocaleString(),
            updatedDate: group.updatedDate.toLocaleString(),
            isActive: group.isActive.toString(),
          };
        })}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
      />
      {data.isFetching && <Spinner size={SpinnerSize.large} />}
    </>
  );
};

const contentStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
    paddingLeft: "24px",
    paddingRight: "24px",
    paddingBottom: "12px",
    minWidth: "330px",
  },
});

export default Groups;