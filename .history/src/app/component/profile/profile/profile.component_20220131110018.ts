import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertService } from 'src/app/services/alert.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { WhiteSpaceValidator } from 'src/app/helpers/whiteSpace.validator';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  verifyOTPForm: FormGroup;
  closeResult: string;
  colorTheme = 'theme-dark-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  country: Array<any> = [];
  dataCountryCode: Array<any> = [];
  activeCountryCode: Array<any> = [];
  submitted: boolean = false;
  submittedOTP: boolean = false;
  userData: any = "";
  config: any;
  selectCountryCode: any;
  selectCountry: number;
  isMobileDisabled: boolean = true;
  isEmailDisabled: boolean = true;
  submittedEmail: boolean = false;
  submittedPhone: boolean = false;
  edit: string;
  ok: string;
  verify: string;
  verified: string;
  emailverify: string = this.verify;
  isChangeEmail: boolean = false;
  isChangeEmailCheck: boolean = false;
  isChangePhone: boolean = false;
  isChangePhoneCheck: boolean = false;
  minDate: Date;
  maxDate: Date;
  headerData: object;
  language: any = [];
  isOpen = false;

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private router: Router, private modalService: NgbModal, private formBuilder: FormBuilder, private loader: LoaderService, private alert: AlertService, private commonService: CommonHttpService) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("User Profile", "user profile", "profile", event.urlAfterRedirects, 20);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = { title: this.language.my_profile, description: '' };
      },
      err => { }
    )

    this.edit = this.language.edit;
    this.ok = this.language.ok;
    this.verify = this.language.verify;
    this.verified = this.language.verified;
    this.headerData = {
      title: this.language.profile, description: ''
    }
    this.userData = this.commonService.getUserData();
    this.getCountryList();
    this.getUserData();
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 100);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 15);
    this.bsConfig = Object.assign({}, { dateInputFormat: 'DD-MM-YYYY', containerClass: this.colorTheme, isAnimated: true, showWeekNumbers: false });
  }




  formBuild() {
    this.profileForm = this.formBuilder.group({
      first_name: ['', [Validators.required, WhiteSpaceValidator.cannotContainSpace]],
      last_name: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      gender: ['1', [Validators.required]],
      country_code: ['', [Validators.required]],
      phone_number: ['', [Validators.required, Validators.pattern(/^(\d{9,15}|)$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)]],
      qualification: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(400), WhiteSpaceValidator.cannotContainSpace]],
      country: ['', [Validators.required]],
      state: [''],
      city: ['', [Validators.required, WhiteSpaceValidator.cannotContainSpace]],
      address: ['', [Validators.required, WhiteSpaceValidator.cannotContainSpace]]
    });
  }

  formOTPBuild() {
    this.verifyOTPForm = this.formBuilder.group({
      otp: ['', [Validators.required]]
    });
  }

  patchValue() {
    this.profileForm.patchValue({
      first_name: this.userData.first_name != null ? this.userData.first_name : "",
      last_name: this.userData.last_name != null ? this.userData.last_name : "",
      dob: this.userData.dob != null ? this.userData.dob : "",
      gender: this.userData.gender != null ? this.userData.gender.toString() : "",
      country_code: this.userData.country_code != null ? this.userData.country_code : "",
      phone_number: this.userData.phone_number != null ? this.userData.phone_number : "",
      email: this.userData.email != null ? this.userData.email : "",
      qualification: this.userData.qualification != null ? this.userData.qualification : "",
      country: this.userData.country != null || 0 ? this.userData.country : "",
      state: this.userData.state != null ? this.userData.state : "",
      city: this.userData.city != null ? this.userData.city : "",
      address: this.userData.address != null ? this.userData.address : "",
    })
    this.countryCodeChanged({ name: this.userData.country_code });
    this.countryChanged(this.userData.country);
  }

  get f() {
    return this.profileForm.controls;
  }

  get fOTP() {
    return this.verifyOTPForm.controls;
  }

  ngOnInit() {
    this.formBuild();
    this.formOTPBuild();
    this.config = this.commonService.setOptions("name");
    // this.getUserData();
  }



  getUserData() {
    const url = "getUser";
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.commonService.shareUserData(data.data);
        this.commonService.setUserData(JSON.stringify(data.data));
      } else {
        this.alert.info(data.message);
      }
    }, error => {
      this.alert.error(error.error.message ? error.error.message : this.language.server_not_responding);
    })
  }

  editPhone() {
    this.isMobileDisabled = this.isMobileDisabled == true ? false : true;
  }

  phoneOk() {
    this.editPhone();
    this.isChangePhone = this.onClickChangePhone();
    this.isChangePhoneCheck = false;
  }

  onClickChangePhone() {
    return this.userData.phone_number == this.profileForm.get('phone_number').value ? false : true;
  }

  onKeyupPhone() {
    this.isChangePhoneCheck = this.onClickChangePhone();
  }

  editEmail() {
    this.isEmailDisabled = this.isEmailDisabled == true ? false : true;
  }

  emailOk() {
    this.editEmail();
    this.isChangeEmail = this.onClickChangeEmail();
    this.isChangeEmailCheck = false;
  }

  onClickChangeEmail() {
    return this.userData.email == this.profileForm.get('email').value ? false : true;
  }

  onKeyupEmail() {
    this.isChangeEmailCheck = this.onClickChangeEmail();
  }


  countryCodeChanged(val) {
    if (val.name != undefined || val.name != null) {
      this.selectCountryCode = val.name;
    }
    if (val.value != undefined || val.value != null) {
      this.selectCountryCode = val.value;
    }
    if (val.name == undefined && val.value == undefined) {
      this.selectCountryCode = '';
    }
    // console.log(val);
    // this.selectCountryCode = val == null ? "" : typeof val.name == 'string' ? val.name : "";

  }

  countryChanged(val) {
    this.selectCountry = val != null ? val.id : "";
  }

  update() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }
    const url = "updateprofile";
    const req_data = this.profileForm.value;
    var date = this.profileForm.get('dob').value;
    delete (req_data['phone_number']);
    delete (req_data['country_code']);
    delete (req_data['email']);
    if (typeof date != "string") {
      req_data['dob'] = date.getDate() + '-' + (parseInt(date.getMonth()) + parseInt('1')) + '-' + date.getFullYear();
    }
    req_data['country'] = this.selectCountry;
    this.loader.display(true);
    this.commonService.commonPostCall(url, req_data).subscribe(data => {
      if (data.status == 200) {
        this.alert.success(data.message);

        this.commonService.shareUserData(data.data);
        this.commonService.setUserData(JSON.stringify(data.data));
      } else {
        this.alert.info(data.message);
      }
      this.loader.display(false);
    }, error => {
      if (typeof error == 'string') {
        this.alert.info(error);
      } else {
        this.alert.error(this.language.server_not_responding);
      }

      this.loader.display(false);
    })
  }

  verifyPhone(content, isResent) {
    this.submittedPhone = true;
    if (this.f.phone_number.errors || this.f.country_code.errors) {
      return;
    }
    if (typeof this.profileForm.get('country_code').value != 'string') {
      this.countryCodeChanged(this.profileForm.get('country_code').value);
    }
    const req_data = { phone_number: this.profileForm.get('phone_number').value, country_code: this.selectCountryCode };
    const url = "resendotp";
    this.loader.display(true);
    this.commonService.commonPostCall(url, req_data).subscribe(data => {
      this.loader.display(false);
      if (data.status == 200) {
        this.isMobileDisabled = true;
        if (!isResent) {
          this.openVerticallyCentered(content);
        }
      } else {
        this.alert.warning(data.message);
      }
    }, error => {
      if (typeof error == 'string') {
        this.alert.error(error);
      } else {
        this.alert.error(error.error ? error.error.message : this.language.server_not_responding);
      }
      this.loader.display(false);
    });
  }


  verifyOpt() {
    this.submittedOTP = true;
    if (this.verifyOTPForm.invalid) {
      return;
    }
    this.loader.display(true);
    const reqData = this.verifyOTPForm.value;
    const url = "verifyotp";
    this.commonService.commonPostCall(url, reqData).subscribe(data => {
      if (data.status == 200) {
        this.alert.success(data.message);
        this.userData['OTP'] = "";
        this.userData['is_phone_verified'] = 1;
        this.isChangePhone = false;
        this.isMobileDisabled = true;
        this.submittedOTP = false;
        const users = data.data;
        this.commonService.shareUserData(users);
        this.commonService.setUserData(JSON.stringify(users));
        this.closeDialog();
      }
      this.loader.display(false);

    }, error => {
      if (error.error && error.error.status == 400) {
        this.alert.info(error.error.message);
      } else if (typeof error == 'string') {
        this.alert.info(error);
      }
      this.loader.display(false);
    })
  }

  verifyEmail(content, isResent) {
    this.submittedEmail = true;
    if (this.profileForm.get('email').invalid) {
      return;
    }
    const req_data = { email: this.profileForm.get('email').value };
    const url = "sendemailverificationlink";
    this.loader.display(true);

    this.commonService.commonPostCall(url, req_data).subscribe(data => {
      if (data.status == 200) {
        this.isEmailDisabled = true;
        this.isChangeEmailCheck == true ? this.userData['email_verified_at'] = null : "";
        this.userData['email'] = this.profileForm.get('email').value;
        this.commonService.shareUserData(this.userData);
        this.commonService.setUserData(JSON.stringify(this.userData));
        if (!isResent) {
          this.openVerticallyCentered(content);
        }

      } else {
        this.alert.warning(data.message);
      }
      this.loader.display(false);
    }, error => {
      if (typeof error == 'string') {
        this.alert.error(error);
      } else {
        this.alert.error(error.error ? error.error.message : this.language.server_not_responding);
      }

      this.loader.display(false);
    });
  }

  getCountryList() {
    this.loader.display(true);
    const url = "countrylist";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.loader.display(false);
      this.country = [...data.data.list];
      this.dataCountryCode = [...data.data.list];
      this.country.forEach((element, index) => {
        if (this.userData.country == element.id) {
          this.userData.country = { name: element.country_name, id: element.id };
        }
        if (this.userData.country_code == element.country_code) {
          this.userData.country_code = { name: element.country_code, id: element.id };
        }

        this.country[index] = { name: element.country_name, id: element.id };
        this.dataCountryCode[index] = { name: element.country_code, id: element.id };
      });
      this.patchValue();
      this.countryChanged(this.userData.country);
      this.countryCodeChanged({ name: this.userData.country_code });
    }, error => {
      this.loader.display(false);
    });
  }






  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // this.closeResult = result;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
  }

  closeDialog() {
    this.modalService.dismissAll();
  }

}
