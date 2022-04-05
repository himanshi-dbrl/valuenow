import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { Router, NavigationEnd } from '@angular/router';
import { MustMatch } from '../../helpers/must-match.validator';
import { AlertService } from 'src/app/services/alert.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { WhiteSpaceValidator } from 'src/app/helpers/whiteSpace.validator';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  myRecaptcha: boolean;
  closeResult: string;
  signupForm: FormGroup;
  submitted: boolean = false;
  passwordType: string = "password";
  textType: string = "text";
  password: string = this.passwordType;
  confirmPassword: string = this.passwordType;
  countryCode: Array<any> = [];
  configCountryCode: any;
  configType: any;
  typeData: Array<any> = [];
  selectCountryCode: string = "+966";
  showPasswordClass: string = "fa-eye";
  hidePasswordClass: string = "fa-eye-slash";
  passwordClass: string = this.showPasswordClass;
  consfirmPasswordClass: string = this.showPasswordClass;
  selectType: any = [];
  terms: any;

  language: any = [];
  constructor(
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private commonService: CommonHttpService,
    private router: Router,
    private alert: AlertService,
    private modalService: NgbModal,
    private googleAnalyticsService: GoogleAnalyticsService

  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("Signup", "Signup", "Signup", event.urlAfterRedirects, 22);
      }
    });


    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
    this.terms = this.language.terms_contents;
    this.commonService.checkLogin(false);
    this.typeData = [{ name: 'Enterprenuer', id: 1 }, { name: 'Investor', id: 2 }];
    this.selectType = { name: 'Enterprenuer', id: 1 };
    this.countryType(this.selectType);
    this.getCountryList();
  }


  ngOnInit() {
    this.buildForm();
    this.configCountryCode = this.commonService.setOptions("country_code");
    this.configType = this.commonService.setOptionsUserType("name");
  }

  countryCodeChanged(val) {
    if (val != undefined) {
      this.selectCountryCode = val.country_code;
    }
  }


  getCountryList() {
    this.loader.display(true);
    const url = "countrylist";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.loader.display(false);
      this.countryCode = [...data.data.list];
    }, error => {
      this.loader.display(false);
    });
  }

  showPassword() {
    this.password = this.password == this.passwordType ? this.textType : this.passwordType;
    this.passwordClass = this.password == this.passwordType ? this.showPasswordClass : this.hidePasswordClass;

  }

  showConfirmPassword() {
    this.confirmPassword = this.confirmPassword == this.passwordType ? this.textType : this.passwordType;
    this.consfirmPasswordClass = this.confirmPassword == this.passwordType ? this.showPasswordClass : this.hidePasswordClass;
  }

  buildForm() {
    this.signupForm = this.formBuilder.group({
      type: [this.typeData[0], [Validators.required]],
      first_name: ['', [Validators.required, WhiteSpaceValidator.cannotContainSpace]],
      last_name: ['', [Validators.required, WhiteSpaceValidator.cannotContainSpace]],
      gender: ['1', [Validators.required]],
      country_code: ['+966', [Validators.required]],
      phone_number: ['', [Validators.required, Validators.pattern(/^(\d{9,15}|)$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), WhiteSpaceValidator.cannotContainSpace]],
      confirm_password: ['', [Validators.required]],
      term_policy: [false, [Validators.requiredTrue]],
      recaptcha: [false, [Validators.requiredTrue]]
    }, {
      validator: MustMatch('password', 'confirm_password')
    });
  }

  get f() {
    return this.signupForm.controls;
  }


  countryType(val) {
    this.selectType = val.id;
  }

  registerNow() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return false;
    }
    this.loader.display(true);
    const req_url = "register";
    const req_data = this.signupForm.value;
    req_data['country_code'] = this.selectCountryCode;
    req_data['type'] = this.selectType;
    this.commonService.commonPostCall(req_url, req_data)
      .subscribe(data => {
        this.loader.display(false);
        if (data.status == 200) {
          const datas = data.data;
          this.router.navigate(["otp"]);
          const userData = JSON.stringify(datas.user);
          this.commonService.shareUserData(data.user);
          const localConfigData = {
            userData: userData,
            token: datas.token
          };

          var type = userData['type'] == 1 ? 'Entrepreneur ' : 'Investor';
          this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
              this
                .googleAnalyticsService
                .eventEmitter("User Signup with " + type, type, "user Signup", event.urlAfterRedirects, 27);
            }
          });
          this.commonService.setLocalConfig(localConfigData);
          this.alert.success(data.message);
        } else {
          this.alert.info(data.message);
        }
      },
        err => {
          this.loader.display(false);
          if (typeof err == 'string') {
            this.alert.info(err);
          } else {
            this.alert.error(this.language.server_not_responding);
          }
        }
      );
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

}
