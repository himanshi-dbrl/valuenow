import { Injectable } from "@angular/core";

@Injectable()
export class Constant {
  common_message: Object = {
    login_success: "Login successful",
    log_out: "You have been successfully logged out.",
    something_wrong: "Something went wrong",
    password_reset_success: "Passsword reset email sent",
    request_bar_success: "Bar requested successfully",
    bar_details_fail: "Cannot find bar details.",
    update_bar_success: "Bar details updated successfully",
    bar_type_fail: "Failed to get bar types",
    invalid_location: "Invalid location. Please choose from dropdown or use map.",
    login_fail: "Invalid credentials",
    bar_status_fail: "Cannot update bar status",
    bartender_details_fail: "Cannot find bartender details",
    update_profile_success: "Profile updated successfully",
    invalid_email: "Invalid Email Address",
    email_not_exists: "Email address does not exists",
    contact_success: "Thank you for contacting us",
    email_send: "Email has not sent",
    please_log_in_to_continue: "Please log in to continue",
    invalid_date: "Please enter a valid date format",
    invalid_date_range: "Please enter a valid date range",
    update_bartender_success: "Bartender details updated successfully",
    pass_and_confirm_pass_doesnt_match: "Password doesn't match the confirm password",
    email_or_password_required: "Please enter an email or password to update",
    enter_confirm_password: "Please confirm the password"
  };
}
