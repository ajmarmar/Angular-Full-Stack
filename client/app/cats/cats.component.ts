import { Component, OnInit } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';

import { CatService } from '../services/cat.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.scss']
})
export class CatsComponent implements OnInit {
  public uploader: FileUploader;
  private fileName: string;

  cat = {image: ''};
  cats = [];
  isLoading = true;
  isEditing = false;
  isAdd = false;

  addCatForm: FormGroup;
  name = new FormControl('', Validators.required);
  age = new FormControl('', Validators.required);
  weight = new FormControl('', Validators.required);

  constructor(private catService: CatService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent) {
    const token = localStorage.getItem('token');
    this.uploader = new FileUploader({url:'/api/upload', autoUpload: true, authToken: `Bearer ${token}`});
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers:any)=>  {
        if (status !== 200) {
          this.toast.setMessage('item deleted successfully.', 'error');
        } else {
          const res = JSON.parse(response);
          if (this.isEditing) {
            this.cat.image=res.fileName || '';
          }
          this.fileName = res.fileName || '';


        }
    };
  }

  ngOnInit() {
    this.getCats();
    this.addCatForm = this.formBuilder.group({
      name: this.name,
      age: this.age,
      weight: this.weight
    });
  }

  enableAdd(){
    this.isAdd=true;
  }
  cancelAdd(){
    this.isAdd=false;
  }

  getCats() {
    this.catService.getCats().subscribe(
      data => this.cats = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addCat() {
    this.uploader.uploadAll();
    const cat = this.addCatForm.value;
    cat.image = this.fileName;
    this.catService.addCat(cat).subscribe(
      res => {
        const newCat = res.json();
        this.cats.push(newCat);
        this.addCatForm.reset();
        this.fileName = '';
        this.isAdd=false;
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(cat) {
    this.isEditing = true;
    this.cat = cat;
    console.log(this.cat);
  }

  cancelEditing() {
    this.isEditing = false;
    this.cat = {image: ''};;
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the cats to reset the editing
    this.getCats();
  }

  editCat(cat) {
    this.catService.editCat(cat).subscribe(
      res => {
        this.isEditing = false;
        this.cat = cat;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteCat(cat) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.catService.deleteCat(cat).subscribe(
        res => {
          const pos = this.cats.map(elem => elem._id).indexOf(cat._id);
          this.cats.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  getImage(file){
    console.log(file);

    const token = localStorage.getItem('token');
    this.http.get(`/api/file/${file}`,
          { headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded',
                                  'Authorization': 'Bearer '+token
                                }),
            responseType: ResponseContentType.ArrayBuffer })
     .map(res => res.arrayBuffer())
     .subscribe(arrayBufferContent => {
       console.log(arrayBufferContent);
     });

  }

}
