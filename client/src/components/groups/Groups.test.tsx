import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Groups from "./Groups";
import { IGroupDto } from "../../generated/backend";

const mockGroup: IGroupDto = {
  name: "fake group",
  createdDate: new Date(),
  updatedDate: new Date(),
  id: 10,
  isActive: true,
};

jest.mock(
  "./addGroupForm/AddGroupForm",
  () =>
    function ({ onSuccess }: any) {
      return (
        <form onSubmit={() => onSuccess(mockGroup)}>
          <button type="submit"></button>
        </form>
      );
    }
);
describe("Groups", () => {
  let container: Element;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("renders a button to add a group", () => {
    act(() => {
      render(<Groups />, container);
    });

    expect(container.querySelector("button").textContent).toBe("Add Group");
  });

  it("renders a form when clicking the Add Group button", () => {
    act(() => {
      render(<Groups />, container);
      openForm(container);
    });

    expect(document.body.querySelector("form")).toBeTruthy();
  });

  it("does not render the Add Group form by default", () => {
    act(() => {
      render(<Groups />, container);
    });

    expect(document.body.querySelector("form")).toBeFalsy();
  });

  it("adds the new group to the page when onSuccess is called", () => {
    act(() => {
      render(<Groups />, container);
      openForm(container);
    });
    act(() => {
      document.body.querySelector("form").dispatchEvent(new Event("submit"));
    });

    expect(
      container.querySelector("div[data-automation-key=id]").textContent
    ).toBe(mockGroup.id.toString());
    expect(
      container.querySelector("div[data-automation-key=name]").textContent
    ).toBe(mockGroup.name);
  });
});

function openForm(container: Element) {
  container
    .querySelector("button")
    .dispatchEvent(new MouseEvent("click", { bubbles: true }));
}
