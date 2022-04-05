import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { WhiteSpaceValidator } from 'src/app/helpers/whiteSpace.validator';
import { AlertService } from 'src/app/services/alert.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { LoaderService } from 'src/app/services/loader.service';

declare let ga: Function; // Declare ga as a function

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.css']
})
export class AddBusinessComponent implements OnInit, AfterContentInit {
  businessForm: FormGroup;
  fieldData: Array<any> = [];
  subField: Array<any>;
  businessType: Array<any> = [];
  country: Array<any> = [];
  dataCountryCode: Array<any> = [];
  numberofEmployess: Array<any> = [];
  activeCountryCode: Array<any> = [];
  submitted: boolean = false;
  config: any;
  fieldconfig:any;
  fconfig: any;
  fbconfig: any;
  configCountry: any;
  configCountryCode: any;
  configEmployeeName: any;
  business_id: any;
  docUrls: Array<any> = [];
  imageUrls: Array<any> = [];
  editFileUrls: Array<any> = [];
  headerData: object = [];
  userData: any;
  language: any = [];

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private alert: AlertService, private loader: LoaderService, private commonService: CommonHttpService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("Business Add", "business add", "business add", event.urlAfterRedirects, 7);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = {
          title: this.language.my_business, description: this.language.my_business + ' ' + this.language.with
        };
      },
      err => { }
    )

    this.config = this.commonService.setOptions("name");
    // if (this.language.typeOf == "1") {
    //   this.fconfig = this.commonService.setOptions("name");
    // } else if (this.language.typeOf == "2") {
    //   this.fconfig = this.commonService.setOptions("ar_name");
    // }
    if (this.language.typeOf == "1") {
      this.configCountry = this.commonService.setOptions("country_name");
      this.fieldconfig= this.commonService.setOptions("name");
      this.fconfig = this.commonService.setOptions("name");
      this.fbconfig = this.commonService.setOptions("name");
    } else if (this.language.typeOf == "2") {
      this.configCountry = this.commonService.setOptions("arCountry_name");
      this.fieldconfig= this.commonService.setOptions("arname");
      this.fconfig = this.commonService.setOptions("arname");
      this.fbconfig = this.commonService.setOptions("arname");
    }
    // this.fconfig = this.commonService.setOptions("name");
    // this.fbconfig = this.commonService.setOptions("name");
    // this.fieldconfig= this.commonService.setOptions("name");
    //this.configCountry = this.commonService.setOptions("country_name");
    this.configCountryCode = this.commonService.setOptions("country_code");
    this.configEmployeeName = this.commonService.setOptions("employeeName");
  }



  get f() {
    return this.businessForm.controls;
  }

  changeField(id) {
    this.getSubfield(id);
  }

  async ngOnInit() {
    this.formBuild();
    this.getField();
    this.getBusinessType();
    this.getCountryList();
    this.getNumberofEmployees();


  }

  ngAfterContentInit() {
    this.route.paramMap.subscribe(params => {
      this.business_id = params.get('id');
      if (this.business_id) {
        setTimeout(() => {
          this.getData(this.business_id);
        }, 1000);
      }
    });
  }


  getData(id) {
    const url = `getBusiness/${id}`;
    this.loader.display(true);
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        console.log(data.data);
        this.setData(data.data);
      } else {
        this.router.navigate(['/business/add']);
      }
      this.loader.display(false);
      return;
    }, error => {
      this.loader.display(false);
    })
  }



  businessDoc(file: FileList) {
    this.businessForm.patchValue({ business_doc: file });
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

  removeDoc(index) {
    this.docUrls.splice(index, 1);
    var file = this.businessForm.get('business_doc').value;
    var newFileList = Array.from(file);
    delete newFileList[index];
    this.businessForm.patchValue({ business_doc: newFileList });
  }

  businessPicture(file: FileList) {
    this.businessForm.patchValue({ business_picture: file });
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

  removeImage(index) {
    this.imageUrls.splice(index, 1);
    var file = this.businessForm.get('business_picture').value;
    var newFileList = Array.from(file);
    delete newFileList[index];
    this.businessForm.patchValue({ business_picture: newFileList });
  }

  formBuild() {
    this.businessForm = this.formBuilder.group({
      business_name: ['', [Validators.required, Validators.minLength(2), WhiteSpaceValidator.cannotContainSpace]],
      field: ['', [Validators.required]],
      sub_field: [''],
      business_type: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: [''],
      city: ['', [Validators.required, WhiteSpaceValidator.cannotContainSpace]],
      address: ['', [Validators.required, WhiteSpaceValidator.cannotContainSpace]],
      mobile_number: ['', [Validators.required, Validators.pattern(/^(\d{9,15}|)$/)]],
      country_code: ['', [Validators.required]],
      year_of_establishment: ['', [Validators.pattern(/^(\d{4,4}|)$/)]],
      information: ['', [Validators.required, WhiteSpaceValidator.cannotContainSpace]],
      estimated_business_value: ['', [Validators.pattern(/^(\d{1,10}|)$/)]],
      number_of_employees: ['', [Validators.required]],
      business_doc: [''],
      business_picture: [''],
    });
  }

  setData(data) {
    let fieldData = { id: data.business_field };
    this.getSubfield(fieldData, true);
    this.businessForm.patchValue({
      business_name: data.business_name,
      information: data.business_info,
      state: data.state != "null" ? data.state : "",
      city: data.city,
      address: data.address,
      year_of_establishment: data.estb_year != "null" ? data.estb_year : "",
      estimated_business_value: data.est_business_value != "null" ? data.est_business_value : "",
      mobile_number: data.mobile,
      country_code: this.changeData(data.country_code, this.dataCountryCode),
      field: this.changeData(data.business_field, this.fieldData),
      business_type: this.changeData(data.business_type, this.businessType),
      country: this.changeData(data.country, this.dataCountryCode),
      number_of_employees: this.changeData(data.employees, this.numberofEmployess),
    });
    this.editFileUrls = data.get_business_files;
  }

  getFileName(url) {
    return url.match(/.*\/(.*)$/)[1];
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


  add() {
    this.submitted = true;
    if (this.businessForm.invalid) {
      return;
    }
    const formData = new FormData();
    let file = this.businessForm.get('business_doc').value;
    if (file) {
      for (let index = 0; index < file.length; index++) {
        if (file[index] != undefined && file[index] != 'empty') {
          formData.append('business_doc[]', file[index], file[index].name);
        }
      }

    }
    let doc = this.businessForm.get('business_picture').value;
    if (doc) {
      for (let index = 0; index < doc.length; index++) {
        if (doc[index] != undefined && doc[index] != 'empty') {
          formData.append('business_picture[]', doc[index], doc[index].name);
        }
      }
    }

    if (this.business_id) {
      formData.append('business_id', this.business_id);
    }

    formData.append('business_name', this.businessForm.get('business_name').value);
    formData.append('business_field', this.businessForm.get('field').value.id);
    formData.append('business_subfield', this.businessForm.get('sub_field').value.id != undefined ? this.businessForm.get('sub_field').value.id : "");
    formData.append('business_type', this.businessForm.get('business_type').value.id);
    formData.append('country', this.businessForm.get('country').value.id);
    formData.append('city', this.businessForm.get('city').value);
    formData.append('state', this.businessForm.get('state').value);
    formData.append('address', this.businessForm.get('address').value);
    formData.append('mobile', this.businessForm.get('mobile_number').value);
    formData.append('country_code', this.businessForm.get('country_code').value.id);
    formData.append('estb_year', this.businessForm.get('year_of_establishment').value);
    formData.append('employees', this.businessForm.get('number_of_employees').value.id);
    formData.append('est_business_value', this.businessForm.get('estimated_business_value').value);
    formData.append('business_info', this.businessForm.get('information').value);
    this.loader.display(true);
    const req_url = "addupdatebusiness";
    this.commonService.commonPostCall(req_url, formData).subscribe(
      data => {
        if (data.status == 200) {
          this.alert.success(data.message);
          this.router.navigate(['business/list']);
        }
        this.loader.display(false);
      }, error => {
        this.loader.display(false);
      }
    )
  }

  removeImageBusiness(id, index) {
    const url = `removeImage/${id}`;
    const data = {};
    this.loader.display(true);
    this.commonService.commonDeleteCall(url, data).subscribe(data => {
      if (data.status == 200) {
        this.editFileUrls.splice(index, 1);
      }
      this.loader.display(false);
    }, error => {
      this.alert.error(error.error ? error.error.message : this.language.server_not_responding);
      this.loader.display(false);
    })
  }

  getNumberofEmployees() {
    this.loader.display(true);
    const url = 'NumberOfEmployees';
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.numberofEmployess = data.data.list;
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
        this.businessForm.patchValue({
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
