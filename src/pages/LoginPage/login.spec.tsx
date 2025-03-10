import {describe, expect, it} from "vitest"
import {render,screen} from "@testing-library/react"
import LoginPage from "./login"


describe("Login Page",()=>{
    it("should render login page with required elements",()=>{
        render(<LoginPage />)
        expect(screen.getByText("Sign in")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button",{name:"Log in"})).toBeInTheDocument();
        expect(screen.getByRole("checkbox",{name:"Remember me"})).toBeInTheDocument();
        expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    })
})