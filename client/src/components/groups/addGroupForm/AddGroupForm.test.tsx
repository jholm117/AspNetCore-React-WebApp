import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { IGroupDto } from "../../../generated/backend";
import { act } from "react-dom/test-utils";

import AddGroupForm from "./AddGroupForm";
import * as fluentui from "@fluentui/react";

describe("AddGroupForm", () => {
  let mockUser: IGroupDto;
  let container: HTMLDivElement = null;
  let onSuccess: jest.Mock<void, any>;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    mockUser = {
      name: "Joni Baez",
      isActive: true,
      createdDate: new Date(),
      updatedDate: new Date(),
      id: 10,
    };

    onSuccess = jest.fn((_response: IGroupDto) => {});

    jest.spyOn(global, "fetch" as any).mockImplementation(() =>
      Promise.resolve({
        text: () => Promise.resolve(JSON.stringify(mockUser)),
        status: 201,
      })
    );
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
    (global as any).fetch.mockRestore();
  });

  it("renders an text input for the name", () => {
    act(() => {
      render(<AddGroupForm onSuccess={onSuccess} />, container);
    });
    const input = container.querySelector("input[type=text]");
    expect(input).toBeTruthy();
    const id = input.id;
    expect(container.querySelector(`label[for=${id}`).textContent).toBe("Name");
  });

  it("requires a name to be entered", () => {
    act(() => {
      render(<AddGroupForm onSuccess={onSuccess} />, container);
    });

    expect(
      container.querySelector("input[type=text]").hasAttribute("required")
    ).toBeTruthy();
  });

  it("renders a checkbox for Is Active", () => {
    act(() => {
      render(<AddGroupForm onSuccess={onSuccess} />, container);
    });

    const checkbox = container.querySelector("input[type=checkbox]");
    expect(checkbox).toBeTruthy();
    expect(
      container.querySelector(`label[for=${checkbox.id}]`).textContent
    ).toBe("Is Active");
  });

  it("calls the onSuccess handler with the response", async () => {
    await act(async () => {
      render(<AddGroupForm onSuccess={onSuccess} />, container);
      submitForm(container, mockUser.name);
    });

    expect(onSuccess).toHaveBeenCalledWith(mockUser);
  });

  it("displays an error message when the api request fails", async () => {
    await act(async () => {
      render(<AddGroupForm onSuccess={onSuccess} />, container);
      jest
        .spyOn(global, "fetch" as any)
        .mockImplementation(() => Promise.reject("the request failed"));

      submitForm(container, mockUser.name);
    });

    expect(container.querySelector(".ms-MessageBar").textContent).toBe(
      "There was an error adding your group."
    );
  });

  it("displays a spinner when the form is submitted", async () => {
    const mockSpinner = jest.fn(() => <div></div>);

    (fluentui as any).Spinner = mockSpinner;
    await act(async () => {
      render(<AddGroupForm onSuccess={onSuccess} />, container);
      submitForm(container, mockUser.name);
    });

    expect(mockSpinner).toHaveBeenCalled();
    mockSpinner.mockRestore();
  });
});

function submitForm(container: Element, textInput: string) {
  const nameInput = container.querySelector("input[type=text]");
  nameInput.nodeValue = textInput;

  const button = container.querySelector("button");
  button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}
