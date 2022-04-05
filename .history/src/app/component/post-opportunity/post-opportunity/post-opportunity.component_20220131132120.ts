import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { WhiteSpaceValidator } from 'src/app/helpers/whiteSpace.validator';
import { AlertService } from 'src/app/services/alert.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { LoaderService } from 'src/app/services/loader.service';

declare var $: any;

@Component({
  selector: 'app-post-opportunity',
  templateUrl: './post-opportunity.component.html',
  styleUrls: ['./post-opportunity.component.css']
})

export class PostOpportunityComponent implements OnInit, AfterContentInit {

  listData: Array<any> = [];
  submitted: boolean = false;
  opportunityForm: FormGroup;
  business: any;
  opportunity: any;
  optional: any;
  rangeInvestment: any;
  fieldData: Array<any> = [];
  subFieldData: Array<any>;
  selectSubField: number;
  businessType: Array<any> = [];
  country: Array<any> = [];
  dataCountryCode: Array<any> = [];
  rangeOfInvestment: Array<any> = [];
  activeCountryCode: Array<any> = [];
  worth: any;
  urls: any = [];
  docurls: any = [];
  config: any;
  fconfig: any;
  fbconfig:any;
  BusinessNameConfig: any;
  employeeNameConfig: any;
  countryConfig: any;
  fieldconfig:any;
  post_id: any;
  is_valuated: number;
  headerData: object;
  imageUrls: Array<any> = [];
  editFileUrls: Array<any> = [];
  businessFileUrls: Array<any> = [];
  investingAsList: Array<any> = [];
  userData: any = [];
  userType: any = 1;
  language: any = [];

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private loader: LoaderService, private alert: AlertService, private commonService: CommonHttpService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("Post Opportunity", "post opportunity", "opportunity", event.urlAfterRedirects, 17);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = {
          title: this.language.post_opportunity, description: this.language.post_opportunity + ' ' + this.language.with
        }
      },
      err => { }
    )

    this.userData = this.commonService.getUserData();
    this.userType = this.userData.type;

    this.getList();
    var fieldName = this.userType == 1 ? "business_name" : "investment_name";
    this.getInvestingAsList();
    this.getField();
    this.getBusinessType();
    this.getCountryList();
    this.getrangeInvestment();
    this.config = this.commonService.setOptions("name");
    if (this.language.typeOf == "1") {
      this.countryConfig = this.commonService.setOptions("country_name");
      this.fconfig = this.commonService.setOptions("name");
      this.fbconfig = this.commonService.setOptions("name");
      this.fieldconfig= this.commonService.setOptions("name");
    } else if (this.language.typeOf == "2") {
      this.countryConfig = this.commonService.setOptions("arCountry_name");
      this.fconfig = this.commonService.setOptions("ar_name");
      this.fbconfig = this.commonService.setOptions("ar_name");
      this.fieldconfig= this.commonService.setOptions("ar_name");
    }

    // this.countryConfig = this.commonService.setOptions("country_name");
    this.BusinessNameConfig = this.commonService.setOptions(fieldName);
    this.employeeNameConfig = this.commonService.setOptions("employeeName");
    this.commonService.userData.subscribe(data => {
      this.userData = data;
      if (this.userData) {
        this.userType = this.userData.type;
      }
    })
  }

  formBuild() {
    var validationField = {
      business: ['', [Validators.required]],
      field: ['', [Validators.required]],
      subField: [''],
      country: ['', [Validators.required]],
      rangeOfInvestment: ['', [Validators.required]],
      lookingFor: ['1', [Validators.required]],
      valuatedBy: [''],
      description: ['', [Validators.required]],
      image: [''],
      document: [''],
      worthofValue: [''],
      valuatedFrom: ['']
    };
    validationField['businessValuated'] = ['', [Validators.required]];
    validationField['businessType'] = ['', [Validators.required]];
    if (this.userType == 1) {
      validationField['businessValuated'] = ['', [Validators.required]];
    } else {
      validationField['businessValuated'] = [''];
    }

    this.opportunityForm = this.formBuilder.group(validationField);

  }



  setData(data) {
    let fieldData = { id: data.field_id }; 
    this.getSubfield(fieldData);
    // if ( data.looking_type == 2) {
    //   data.looking_type = "2"
    // } else if(data.looking_type == 1){
    //   data.looking_type = "1"
    // }
    this.opportunityForm.patchValue({
      business: this.findField(this.listData, data.business_id),
      description: data.description,
      investAs_id: this.findField(this.investingAsList, data.investAs_id),
      field: this.findField(this.fieldData, data.field_id),
      country: this.findField(this.country, data.country_id),
      rangeOfInvestment: this.findField(this.rangeOfInvestment, data.range_of_investment_id),
      lookingFor: String(data.looking_type),
     
    });

    

    this.opportunityForm.patchValue({
      businessValuated: String(data.is_valuated),
      businessType: this.findField(this.businessType, data.business_type_id)
    });

    

    if (this.userType == 1) {
      
    }
    this.selectSubField = data.sub_field_id;
    this.checkBusinessValuated(data.is_valuated);
    if (data.is_valuated == 0) {
      this.opportunityForm.patchValue({
        valuatedFrom: String(data.is_valuated_from_valueNow)
      })
    } else {
      this.opportunityForm.patchValue({
        worthofValue: data.idea_worth_of,
        valuatedBy: String(data.valuated_by),
      })
    }

    this.editFileUrls = data.get_post_images;
    this.businessFileUrls = data.get_business != null ? data.get_business.get_business_files : [];
  }

  findField(findData, value) {
    var data;
    findData.forEach(element => {
      if (element.id == value) {
        data = element;
      }
    });
    return data;
  }

  get f() {
    return this.opportunityForm.controls;
  }

  whiteSpaceValidation() {
    this.opportunityForm.get('description').setValidators([WhiteSpaceValidator.cannotContainSpace]);
  }

  checkBusinessValuated(value) {
    this.is_valuated = value;
  }

  Check(status) {
    this.worth = status;
    const worthofValue = this.opportunityForm.get('worthofValue');
    const valuatedBy = this.opportunityForm.get('valuatedBy');
    const document = this.opportunityForm.get('document');
    const image = this.opportunityForm.get('Image');
    const valuatedFrom = this.opportunityForm.get('valuatedFrom');
    var valuatedByYes;
    var valuatedByNo;
    var valuatedByYesWorth;
    if (status == 1) {
      valuatedByYes = [Validators.required];
      valuatedByYesWorth = [Validators.required, WhiteSpaceValidator.cannotContainSpace];
      valuatedByNo = [];
    } else {
      valuatedByNo = [Validators.required];
      valuatedByYes = [];
      valuatedByYesWorth = [];
    }
    worthofValue.setValidators(valuatedByYesWorth);
    valuatedBy.setValidators(valuatedByYes);
    if (this.editFileUrls.length == 0) {
      document.setValidators(valuatedByYes);
      image.setValidators(valuatedByYes);
      document.updateValueAndValidity();
      image.updateValueAndValidity();
    }

    worthofValue.updateValueAndValidity();
    valuatedBy.updateValueAndValidity();

    valuatedFrom.setValidators(valuatedByNo);
    valuatedFrom.updateValueAndValidity();
  }

  ngOnInit() {
    this.formBuild();

  }

  ngAfterContentInit() {
    this.route.paramMap.subscribe(params => {
      this.post_id = params.get('id');
      if (this.post_id) {
        setTimeout(() => {
          this.getData();
        }, 1000);
      }
    });
  }

  getData() {
    const url = `getPost/${this.post_id}`;
    this.loader.display(true);
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.setData(data.data);
      } else {
        this.router.navigate(['/opportunity/add']);
      }
      this.loader.display(false);
      return;
    }, error => {
      this.loader.display(false);
    })
  }

  removeImagePost(id, index) {
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

  selectBussiness(value) {
    this.selectSubField = value.business_subfield;
    const fieldData = { id: value.business_field };
    this.getSubfield(fieldData);

    var patchData = {
      description: value.business_info,
      field: this.findField(this.fieldData, value.business_field),
      country: this.findField(this.country, value.country)
    };

    if (this.userType == 1) {
      patchData['businessType'] = this.findField(this.businessType, value.business_type);
      this.businessFileUrls = value.get_business_files;
    } else {
      patchData['businessType'] = this.findField(this.businessType, value.business_type);
      this.businessFileUrls = value.get_business_files;
      patchData['investAs_id'] = this.findField(this.investingAsList, value.investAs_id);
      this.businessFileUrls = value.get_files;
    }
    this.opportunityForm.patchValue(patchData);
  }


  getList() {
    this.loader.display(true);
    var url = this.userType == 1 ? "businesslist" : "workplace";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.listData = this.userType == 1 ? data.data : data.data;
      this.loader.display(false);
    }, error => {
      this.loader.display(false);
    });

  }


  getInvestingAsList() {
    this.loader.display(true);
    const url = "investingAs";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.investingAsList = data.data.list;
      this.loader.display(false);
    }, error => {
      this.loader.display(false);
    });
  }

  getrangeInvestment() {
    this.loader.display(true);
    const url = 'rangeInvestment';
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.rangeOfInvestment = data.data.list;
      }
      this.loader.display(false);
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
    }, error => {
      this.loader.display(false);
    })
  }

  getSubfield(value) {
    this.loader.display(true);
    const url = 'fieldList';
    this.commonService.commonGetWidthIdCall(url, value.id).subscribe(data => {
      this.subFieldData = data.data.list.subfield != null ? data.data.list.subfield : [];

      if (this.selectSubField != null && this.selectSubField > 0 && this.subFieldData != undefined) {
        this.opportunityForm.patchValue({
          subField: this.findField(this.subFieldData, this.selectSubField)
        })
      } else {
        this.opportunityForm.patchValue({
          subField: ''
        })
      }

      this.loader.display(false);
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
    }, error => {
      this.loader.display(false);
    });
  }



  postDoc(file: FileList) {
    this.opportunityForm.patchValue({ document: file });
    this.docurls = [];
    var filesAmount = file.length;
    for (let i = 0; i < filesAmount; i++) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.docurls.push({ 'url': event.target.result, 'name': file[i].name });
      }
      reader.readAsDataURL(file[i]);
    }
  }

  removeDoc(index) {
    this.docurls.splice(index, 1);
    var file = this.opportunityForm.get('document').value;
    var newFileList = Array.from(file);
    delete newFileList[index];
    this.opportunityForm.patchValue({ document: newFileList });
  }

  postPicture(file: FileList) {
    let format;
    this.opportunityForm.patchValue({ image: file });
    this.urls = [];
    var filesAmount = file.length;
    for (let i = 0; i < filesAmount; i++) {
      if (file[i].type.indexOf('image') > -1) {
        format = 'image';
      } else if (file[i].type.indexOf('video') > -1) {
        format = 'video';
      }
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.urls.push({ 'url': event.target.result, 'name': file[i].name, 'format': format });
      }
      reader.readAsDataURL(file[i]);
    }
  }

  removeImage(index) {
    this.urls.splice(index, 1);
    var file = this.opportunityForm.get('image').value;
    var newFileList = Array.from(file);
    delete newFileList[index];
    this.opportunityForm.patchValue({ image: newFileList });
  }

  add() {
    this.submitted = true;
    if (this.opportunityForm.invalid) {
      return;
    }

    const formData = new FormData();
    if (this.post_id) {
      formData.append('post_id', this.post_id);
    }
    let doc = this.opportunityForm.get('document').value;
    let file = this.opportunityForm.get('image').value;
    if (file) {
      for (let index = 0; index < file.length; index++) {
        if (file[index] != undefined && file[index] != 'empty') {
          formData.append('opportunity_photo[]', file[index], file[index].name);
        }

      }
    }

    if (doc) {
      for (let index = 0; index < doc.length; index++) {
        if (doc[index] != undefined && doc[index] != 'empty') {
          formData.append('opportunity_doc[]', doc[index], doc[index].name);
        }
      }
    }
    let buisnessValuated = this.opportunityForm.get('businessValuated').value;

    formData.append('business_id', this.opportunityForm.get('business').value.id);
    formData.append('field_id', this.opportunityForm.get('field').value.id);
    formData.append('sub_field_id', this.opportunityForm.get('subField').value.id != undefined ? this.opportunityForm.get('subField').value.id : "");
    formData.append('business_type_id', this.opportunityForm.get('businessType').value.id);
    formData.append('country_id', this.opportunityForm.get('country').value.id);
    formData.append('range_of_investment_id', this.opportunityForm.get('rangeOfInvestment').value.id);
    formData.append('looking_type', this.opportunityForm.get('lookingFor').value);
    formData.append('is_valuated', this.userType == 1 ? this.opportunityForm.get('businessValuated').value : "");

    if (buisnessValuated == 1) {
      formData.append('idea_worth_of', this.opportunityForm.get('worthofValue').value);
      formData.append('valuated_by', this.opportunityForm.get('valuatedBy').value);
    } else {
      formData.append('is_valuated_from_valueNow', this.opportunityForm.get('valuatedFrom').value);
    }
    formData.append('description', this.opportunityForm.get('description').value);
    this.loader.display(true);
    const req_url = "addupdatepost";
    this.commonService.commonPostCall(req_url, formData).subscribe(
      data => {
        if (data.status == 200) {
          this.alert.success(data.message);
          this.router.navigate(['dashboard']);
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
      }
    )
  }

}
