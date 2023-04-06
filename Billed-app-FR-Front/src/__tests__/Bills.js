/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import userEvent from "@testing-library/user-event";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

jest.mock("../__mocks__/store", () => jest.fn());

// Mock store function that returns a resolved promise with an array of bill data
const mockStore = {
  bills: jest.fn(() => ({
    list: jest.fn(() => {
      return Promise.resolve([
        {
          id: "bill_1",
          email: "john.doe@example.com",
          type: "Hôtel et logement",
          name: "Hotel de Paris",
          date: "2022-03-20",
          amount: 200,
          status: "pending",
          commentAdmin: "Facture non conforme",
          commentExpense: "Déplacement professionnel",
          vat: 40,
          pct: 20,
        },
        {
          id: "bill_2",
          email: "jane.doe@example.com",
          type: "Restaurants et bars",
          name: "La Belle Équipe",
          date: "2022-03-10",
          amount: 150,
          status: "accepted",
          commentAdmin: "",
          commentExpense: "Déjeuner d'affaires",
          vat: 30,
          pct: 20,
        },
      ]);
    }),
  })),
};

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");

      // Adding by me

      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    // Adding by me
    test("When I Click on the icon eye", () => {
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      document.body.innerHTML = BillsUI({ data: bills });

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const store = null;

      const test = new Bills({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });

      const handleClickIconEye = jest.fn((icon) =>
        test.handleClickIconEye(icon)
      );

      const eye = screen.getAllByTestId("icon-eye");

      eye.forEach((icon) => {
        icon.addEventListener("click", handleClickIconEye(icon));
        userEvent.click(icon);
        expect(handleClickIconEye).toHaveBeenCalled();

        const modale = screen.getByTestId("modaleFile");
        expect(modale).toBeTruthy();
      });
    });

    // Adding by me
    test("Then click on new Bill", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const test = new Bills({
        document,
        onNavigate,
        store: null,
        bills: bills,
        localStorageMock: window.localStorage,
      });

      document.body.innerHTML = BillsUI({ data: { bills } });

      const newBillButton = screen.getByTestId("btn-new-bill");
      const handleClickNewBill = jest.fn(test.handleClickNewBill);
      newBillButton.addEventListener("click", handleClickNewBill);
      fireEvent.click(newBillButton);
      expect(handleClickNewBill).toHaveBeenCalled();
    });

    // Adding by me
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "employee@jest.test" })
      );

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const test = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorageMock: window.localStorage,
      });

      const bills = await test.getBills();

      expect(bills.length).toBe(2);
    });

    // Adding by me
    test("fetches bills from mock API GET with error 400", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "employee@jest.test" })
      );

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const test = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorageMock: window.localStorage,
      });

      try {
        await test.getBills("400");
      } catch (e) {
        expect(e.message).toBe("Erreur 400");
      }
    });

    // Adding by me
    test("fetches bills from mock API GET with error 500", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "employee@jest.test" })
      );

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const test = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorageMock: window.localStorage,
      });

      try {
        await test.getBills("500");
      } catch (e) {
        expect(e.message).toBe("Erreur 500");
      }
    });
  });
});
