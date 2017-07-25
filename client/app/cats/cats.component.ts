import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { CatService } from '../services/cat.service';
import { SocketService } from '../services/socket.service';
import { MessageSocket } from '../models/messageSocket';

import { Cat } from '../models/cat';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.scss']
})
export class CatsComponent implements OnInit, OnDestroy {
  public uploader: FileUploader;
  private fileName: string;
  private connection;

  cat: Cat =  new Cat('', '', 0, 0, '');
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
              private socketService: SocketService,
              private toastrService: ToastrService ) {

    const token = localStorage.getItem('token');
    this.uploader = new FileUploader( { url: '/api/upload', autoUpload: true, authToken: `Bearer ${token}` } );
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) =>  {
        if (status !== 200) {
          this.toastrService.error('There was an error uploading the image');
        } else {
          const res = JSON.parse(response);
          if (this.isEditing) {
            this.cat.image = res.fileName || '';
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
    this.connection = this.socketService.getMessages().subscribe(message => {
         const msg = <MessageSocket>message;
         if (msg.emitedBy !== this.socketService.getId()) {
           this.toastrService.success(msg.message, 'Notification');
         }
    });
  }

  ngOnDestroy() {
      this.connection.unsubscribe();
  }

  enableAdd() {
    this.isAdd = true;
  }
  cancelAdd() {
    this.isAdd = false;
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
        this.isAdd = false;
        this.toastrService.success('item added successfully.');
        this.socketService.sendMessage('An item was added');
      },
      error => console.log(error)
    );
  }

  enableEditing(cat) {
    this.isEditing = true;
    this.cat = cat;
  }

  cancelEditing() {
    this.isEditing = false;
    this.cat = new Cat('', '', 0, 0, '');
    this.toastrService.warning('item editing cancelled.');
    // reload the cats to reset the editing
    this.getCats();
  }

  editCat(cat) {
    this.catService.editCat(cat).subscribe(
      res => {
        this.isEditing = false;
        this.cat = cat;
        this.toastrService.success('item edited successfully.');
        this.socketService.sendMessage('An item wad modified');
      },
      error => console.log(error)
    );
  }

  deleteCat(cat) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.catService.deleteCat(cat).subscribe (
        res => {
          const pos = this.cats.map(elem => elem._id).indexOf(cat._id);
          this.cats.splice(pos, 1);
          this.toastrService.success('item deleted successfully.');
          this.socketService.sendMessage('An item was deleted');
        },
        error => console.log(error)
      );
    }
  }

  getImage(file) {
    const token = localStorage.getItem('token');
    this.http.get(`/api/file/${file}`,
          { headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded',
                                  'Authorization': 'Bearer ' + token
                                }),
            responseType: ResponseContentType.ArrayBuffer })
     .map(res => res.arrayBuffer())
     .subscribe(arrayBufferContent => {
       console.log(arrayBufferContent);
     });
  }
}
