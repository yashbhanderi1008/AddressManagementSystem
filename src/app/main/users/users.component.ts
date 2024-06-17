import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) { }

  form!: FormGroup;
  selectedUser: any;
  submitted = false;

  @Input() users: any[] = [];
  @Output() listUpdate: EventEmitter<any> = new EventEmitter();

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get addresses() {
    return this.f['addresses'] as FormArray
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      userId: [{ value: '', disabled: true }, Validators.required],
      username: ['', [Validators.required, Validators.pattern('^[a-z\sA-Z ]+$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$')]],
      addresses: this.formBuilder.array([])
    })
  }

  addAddress(): void {
    if (this.addresses.controls.every(control => control.valid)) {
      const addressForm = this.formBuilder.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
      });

      this.addresses.push(addressForm);
    } else {
      this.submitted = true
    }
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  getAddressFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const updateUser = this.form.getRawValue();
  
    const userIds = this.users.map((user: any) => user.userId)
    const index = userIds.indexOf(this.selectedUser.userId);

    if (index !== -1) {
      this.users[index] = updateUser;

      this.submitted = false;
    }

    this.listUpdate.emit(this.users);
  }

  onReset(): void {
    this.form.reset();
    this.addresses.clear();
    this.submitted = false;
  }

  onSelectUser(user: any) {
    this.form.reset();
    this.selectedUser = user;

    this.form.patchValue({
      userId: user.userId,
      username: user.username,
      email: user.email
    });

    while (this.addresses.length !== 0) {
      this.addresses.removeAt(0);
    }

    user.addresses.forEach((address: any) => {
      this.addresses.push(this.createAddressFormGroup(address));
    });
  }

  createAddressFormGroup(address: any) {
    return this.formBuilder.group({
      street: [address.street, Validators.required],
      city: [address.city, Validators.required],
      state: [address.state, Validators.required],
      zipCode: [address.zipCode, [Validators.required, Validators.pattern('[0-9]{5}')]]
    });
  }
}
