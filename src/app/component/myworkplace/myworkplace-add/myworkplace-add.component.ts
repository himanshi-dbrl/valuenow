import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
import { WhiteSpaceValidator } from 'src/app/helpers/whiteSpace.validator';
import { AlertService } from 'src/app/services/alert.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-myworkplace-add',
  templateUrl: './myworkplace-add.component.html',
  styleUrls: ['./myworkplace-add.component.css']
})
export class MyworkplaceAddComponent implements OnInit, AfterContentInit {

  headerData: object;
  myWorkPlackForm: FormGroup;
  fieldData: Array<any> = [];
  subField: Array<any>;
  businessType: Array<any> = [];
  country: Array<any> = [];
  dataCountryCode: Array<any> = [];
  numberofEmployess: Array<any> = [];
  activeCountryCode: Array<any> = [];
  editFileUrls: Array<any> = [];
  submitted: boolean = false;
  config: any;
  fconfig: any;
  fbconfig: any;
  configCountry: any;
  fieldconfig:any;
  userData: any;
  configCountryCode: any;
  minDate: Date;
  maxDate: Date;
  colorTheme: string = 'theme-dark-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  url: any = "";
  data: any = [];
  docUrls: any = [];
  imageUrls: any = [];
  workplaceId: string;
  language: any = [];

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private alert: AlertService, private loader: LoaderService, private commonService: CommonHttpService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("My Workplace Add", "workplace add", "workplace", event.urlAfterRedirects, 11);
      }
    });


    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = { title: this.language.investor_workplace, description: this.language.investor_workplace + ' ' + this.language.with_add };
      },
      err => { }
    )

    this.commonService.userData.subscribe(data => {
      this.userData = data;
    })

    if (this.language.typeOf == "1") {
      this.configCountry = this.commonService.setOptions("country_name");
      this.fieldconfig= this.commonService.setOptions("name");
      this.fconfig = this.commonService.setOptions("name");
      this.fbconfig = this.commonService.setOptions("name");
    } else if (this.language.typeOf == "2") {
      this.configCountry = this.commonService.setOptions("arCountry_name");
      this.fieldconfig= this.commonService.setOptions("ar_name");
      this.fconfig = this.commonService.setOptions("ar_name");
      this.fbconfig = this.commonService.setOptions("ar_name");
    }

    
    // this.fconfig = this.commonService.setOptions("name");
    // this.fbconfig = this.commonService.setOptions("name");
    // this.fieldconfig= this.commonService.setOptions("name");
    // this.configCountry = this.commonService.setOptions("country_name");
    this.configCountryCode = this.commonService.setOptions("country_code");
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 100);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 15);
    this.bsConfig = Object.assign({}, { dateInputFormat: 'DD-MM-YYYY', containerClass: this.colorTheme, isAnimated: true, showWeekNumbers: false });
  }

  get f() {
    return this.myWorkPlackForm.controls;
  }

  changeField(id) {
    this.getSubfield(id);
  }

  uploadImage(file: FileList) {
    this.myWorkPlackForm.patchValue({ investor_picture: file });
    this.url = [];
    var filesAmount = file.length;
    for (let i = 0; i < filesAmount; i++) {
      if (file[i].type.indexOf('image') > -1) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.url = event.target.result;
        }
        reader.readAsDataURL(file[i]);
      }
    }
  }

  formBuild() {
    this.myWorkPlackForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), WhiteSpaceValidator.cannotContainSpace]],
      field: ['', [Validators.required]],
      sub_field: [''],
      business_type: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: [''],
      city: ['', [Validators.required, WhiteSpaceValidator.cannotContainSpace]],
      address: ['', [Validators.required, WhiteSpaceValidator.cannotContainSpace]],
      year_of_investment: ['', [Validators.required, Validators.pattern(/^(\d{4,5}|)$/)]],
      mobile_number: ['', [Validators.required, Validators.pattern(/^(\d{9,15}|)$/)]],
      country_code: ['', [Validators.required]],
      description: ['', [Validators.required, WhiteSpaceValidator.cannotContainSpace]],
      workplace_picture: [''],
      workplace_doc: [''],
    });

  }

  setData(data) {
    console.log(data);
    let fieldData = { id: data.business_field };
    this.getSubfield(fieldData, true);
    this.myWorkPlackForm.patchValue({
      name: data.investment_name,
      description: data.description,
      year_of_investment: data.year_of_investment,
      state: data.state != "null" ? data.state : "",
      city: data.city,
      address: data.address,
      mobile_number: data.phone_number,
      country_code: this.changeData(data.country_code, this.dataCountryCode),
      field: this.changeData(data.business_field, this.fieldData),
      business_type: this.changeData(data.business_type, this.businessType),
      country: this.changeData(data.country, this.dataCountryCode),
    });
    this.editFileUrls = data.get_files;

  }

  workplaceDoc(file: FileList) {
    this.myWorkPlackForm.patchValue({ workplace_doc: file });
    this.docUrls = [];
    var filesAmount = file.length;
    for (let i = 0; i < filesAmount; i++) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.docUrls.push({ 'url': event.target.result, 'name': file[i].name });
      }
      reader.readAsDataURL(file[i]);
    }

  }


  removeImageWorkplace(id, index) {
    const url = `removeImage/${id}`;
    const data = {};
    this.loader.display(true);
    this.commonService.commonDeleteCall(url, data).subscribe(data => {
      if (data.status == 200) {
        this.editFileUrls.splice(index, 1);
      }
      this.loader.display(false);
    }, error => {
      this.alert.error(error.error ? error.error.message : this.language.server.server_not_responding);
      this.loader.display(false);
    })
  }

  removeDoc(index) {
    this.docUrls.splice(index, 1);
    var file = this.myWorkPlackForm.get('workplace_picture').value;
    var newFileList = Array.from(file);
    delete newFileList[index];
    this.myWorkPlackForm.patchValue({ workplace_picture: newFileList });
  }

  businessPicture(file: FileList) {
    this.myWorkPlackForm.patchValue({ workplace_picture: file });
    this.imageUrls = [];
    let format;
    var filesAmount = file.length;
    for (let i = 0; i < filesAmount; i++) {
      if (file[i].type.indexOf('image') > -1) {
        format = 'image';
      } else if (file[i].type.indexOf('video') > -1) {
        format = 'video';
      }
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrls.push({ 'url': event.target.result, 'name': file[i].name, 'format': format });
      }
      reader.readAsDataURL(file[i]);
    }
  }

  changeData(id, data) {
    var data;
    data.forEach(element => {
      if (element.id == id) {
        data = element;
      }
    });
    return data;
  }

  ngOnInit() {
    this.formBuild();
    this.getField();
    this.getBusinessType();
    this.getCountryList();
  }

  ngAfterContentInit() {
    this.route.paramMap.subscribe(params => {
      this.workplaceId = params.get('id');
      if (this.workplaceId) {
        setTimeout(() => {
          this.getWorkPlace(this.workplaceId);
        }, 1000);
      }
    });
  }


  removeImage() {
    this.url = "";
    this.myWorkPlackForm.patchValue({ investor_picture: '' });
    if (this.data && this.data.profile_picture != null) {
      this.imageRemove();
    }

  }

  imageRemove() {
    const url = "removeProfilePic";
    this.loader.display(true);
    this.commonService.commonPostCall(url, {}).subscribe(data => {
      if (data.status == 200) {
        this.url = "";
        this.data.profile_picture = null;
      } else {
        this.alert.error(data.message);
      }
      this.loader.display(false);
    }, error => {
      this.alert.error(error.message);
      this.loader.display(false);
    })
  }

  save() {
    this.submitted = true;
    if (this.myWorkPlackForm.invalid) {
      return false;
    }

    const formData = new FormData();
    let file = this.myWorkPlackForm.get('workplace_picture').value;
    if (file && file != '') {
      for (let index = 0; index < file.length; index++) {
        if (file[index] != undefined && file[index] != 'empty') {
          formData.append('workplace_picture[]', file[index], file[index].name);
        }
      }
    }

    let doc = this.myWorkPlackForm.get('workplace_doc').value;
    if (doc && doc != '') {
      for (let index = 0; index < doc.length; index++) {
        if (doc[index] != undefined && doc[index] != 'empty') {
          formData.append('workplace_doc[]', doc[index], doc[index].name);
        }
      }
    }

    var date = this.myWorkPlackForm.get('year_of_investment').value;
    formData.append('investment_name', this.myWorkPlackForm.get('name').value);
    formData.append('business_field', this.myWorkPlackForm.get('field').value.id);
    formData.append('business_subfield', this.myWorkPlackForm.get('sub_field').value.id != undefined ? this.myWorkPlackForm.get('sub_field').value.id : "");
    formData.append('business_type', this.myWorkPlackForm.get('business_type').value.id);
    formData.append('country', this.myWorkPlackForm.get('country').value.id);
    formData.append('city', this.myWorkPlackForm.get('city').value);
    formData.append('state', this.myWorkPlackForm.get('state').value);
    formData.append('address', this.myWorkPlackForm.get('address').value);
    formData.append('phone_number', this.myWorkPlackForm.get('mobile_number').value);
    formData.append('country_code', this.myWorkPlackForm.get('country_code').value.id);
    formData.append('year_of_investment', date);
    formData.append('description', this.myWorkPlackForm.get('description').value);
    if (this.workplaceId) {
      formData.append('workplace_id', this.workplaceId);
    }
    this.loader.display(true);
    const url = "workplace";
    this.commonService.commonPostCall(url, formData).subscribe(data => {
      if (data.status == 200) {
        this.data = data.data;
        this.router.navigate(['/workplace/list'])
        this.alert.success(data.message);
      } else {
        this.alert.error(data.message);
      }
      this.loader.display(false);
    }, error => {
      this.alert.error(error.message);
      this.loader.display(false);
    })

  }

  getWorkPlace(id) {
    this.loader.display(true);
    const url = `workplace/${id}`;
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.data = data.data;
        this.setData(this.data);
      }
      this.loader.display(false);
      return;
    }, error => {
      this.loader.display(false);
    })
  }

  getField() {
    this.loader.display(true);
    const url = 'fieldList';
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.fieldData = data.data.list;
      }
      this.loader.display(false);
      return;
    }, error => {
      this.loader.display(false);
    })
  }

  getSubfield(req, isSet = false) {
    this.loader.display(true);
    const url = 'fieldList';
    this.commonService.commonGetWidthIdCall(url, req.id).subscribe(data => {
      this.subField = data.data.list != null && data.data.list.subfield != null ? data.data.list.subfield : [];
      if (isSet) {
        this.myWorkPlackForm.patchValue({
          sub_field: this.changeData(data.business_subfield, this.subField),
        });

      }
      this.loader.display(false);
      return;
    }, error => {
      this.loader.display(false);
    })
  }

  getBusinessType() {
    this.loader.display(true);
    const url = "BusinessType";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.loader.display(false);
      this.businessType = data.data.list;
      return;
    }, error => {
      this.loader.display(false);
    }
    )
  }

  getCountryList() {
    this.loader.display(true);
    const url = "countrylist";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.loader.display(false);
      this.country = [...data.data.list];
      this.dataCountryCode = [...data.data.list];
      return;
    }, error => {
      this.loader.display(false);
    });
  }

}
