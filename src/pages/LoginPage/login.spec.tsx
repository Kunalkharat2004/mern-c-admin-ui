import {describe, expect, it} from "vitest"
import {render,screen} from "@testing-library/react"
import LoginPage from "./login"


describe("Login Page",()=>{
    it("should render login page with required elements",()=>{
        render(<LoginPage />)
        expect(screen.getByRole("heading",{name:"Sign In"})).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button",{name:"Sign In"})).toBeInTheDocument();
        expect(screen.getByRole("checkbox",{name:"Remember me"})).toBeInTheDocument();
        expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    })
})