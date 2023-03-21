/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import { ROUTES } from "../constants/routes.js";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import Store from "../app/Store.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then It should renders New Bill Page", () => {
      document.body.innerHTML = NewBillUI();

      expect(screen.getByTestId("Envoyer-une-note-de-frais")).toBeTruthy();
    });
  });

  describe("When Form is Submit", () => {
    test("Check if function is correctly called", () => {
      document.body.innerHTML = NewBillUI();

      // Adding by me

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe("When new Bill if submit", () => {
    test("Check if submit function work!", () => {
      document.body.innerHTML = NewBillUI();

      // Set localstorage for test
      window.localStorage.setItem(
        "user",
        JSON.stringify({ email: "test@jest.com" })
      );

      // data test
      const data = {
        amount: parseInt(300),
        commentary: "Jest Test",
        date: "2023-03-15",
        email: "test@jest.com",
        fileName: "jesttest.png",
        fileUrl: undefined,
        name: "Jest Test",
        pct: 20,
        status: "pending",
        type: "Restaurants et bars",
        vat: "20",
      };

      // Get virtual DOM Ref
      const DOM = {
        type: screen.getByTestId("expense-type"),
        name: screen.getByTestId("expense-name"),
        date: screen.getByTestId("datepicker"),
        amount: screen.getByTestId("amount"),
        vat: screen.getByTestId("vat"),
        pct: screen.getByTestId("pct"),
        commentary: screen.getByTestId("commentary"),
        file: screen.getByTestId("file"),
      };

      // Set test data to virtual DOM

      describe("Change type", () => {
        fireEvent.change(DOM.type, { target: { value: data.type } });
        expect(DOM.type.value).toBe(data.type);
      });

      describe("Change name", () => {
        fireEvent.change(DOM.name, { target: { value: data.name } });
        expect(DOM.name.value).toBe(data.name);
      });

      describe("Change date", () => {
        fireEvent.change(DOM.date, { target: { value: data.date } });
        expect(DOM.date.value).toBe(data.date);
      });

      describe("Change amount", () => {
        fireEvent.change(DOM.amount, {
          target: { value: data.amount },
        });
        expect(parseInt(DOM.amount.value)).toBe(data.amount);
      });

      describe("Change vat", () => {
        fireEvent.change(DOM.vat, { target: { value: data.vat } });
        expect(DOM.vat.value).toBe(data.vat);
      });

      describe("Change ptc", () => {
        fireEvent.change(DOM.pct, { target: { value: data.pct } });
        expect(parseInt(DOM.pct.value)).toBe(data.pct);
      });

      describe("Change commentary", () => {
        fireEvent.change(DOM.commentary, {
          target: { value: data.commentary },
        });
        expect(DOM.commentary.value).toBe(data.commentary);
      });

      describe("Change File", () => {
        fireEvent.change(DOM.file, {
          target: {
            values: new File(["(⌐□_□)"], "chucknorris.png", {
              type: "image/png",
            }),
          },
        });
      });

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const store = null;
      const addingBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn(addingBill.handleSubmit);
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
    });

    test("It should renders Bills Page", () => {
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    });

    describe("When file is selected", () => {
      const data = {
        amount: parseInt(300),
        commentary: "Jest Test",
        date: "2023-03-15",
        email: "test@jest.com",
        fileName: "jesttest.png",
        fileUrl: undefined,
        name: "Jest Test",
        pct: 20,
        status: "pending",
        type: "Restaurants et bars",
        vat: "20",
      };

      document.body.innerHTML = NewBillUI();

      // Set localstorage for test
      window.localStorage.setItem(
        "user",
        JSON.stringify({ email: "test@jest.com" })
      );

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: Store,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn(() => newBill.handleChangeFile);
      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["file.png"], "file.png", { type: "image/png" })],
        },
      });

      const nFile = screen.getByTestId("file").files.length;
      expect(nFile).toEqual(1);
    });
  });
});
