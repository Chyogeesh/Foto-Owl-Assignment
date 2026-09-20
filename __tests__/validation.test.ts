import {
  validateEmail,
  validateLoginForm,
  validateMobile,
  validateProfileForm,
  validateRegisterForm,
  type RegisterFormValues,
} from '../src/utils/validation';

const validForm: RegisterFormValues = {
  fullName: 'Asha Rao',
  email: 'asha@example.com',
  gender: 'Female',
  mobile: '9876543210',
  address: '12 Main Road',
  city: 'Vijayawada',
  password: 'secret1',
  confirmPassword: 'secret1',
};

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('a@b.co')).toBe(true);
    expect(validateEmail('  user.name@mail.example.com ')).toBe(true);
  });
  it('rejects invalid emails', () => {
    ['', 'plain', 'a@b', '@b.com', 'a b@c.com'].forEach((value) => {
      expect(validateEmail(value)).toBe(false);
    });
  });
});

describe('validateMobile', () => {
  it('accepts exactly 10 digits', () => {
    expect(validateMobile('9876543210')).toBe(true);
  });
  it('rejects wrong length or non-digits', () => {
    expect(validateMobile('98765')).toBe(false);
    expect(validateMobile('98765432101')).toBe(false);
    expect(validateMobile('98765abcde')).toBe(false);
  });
});

describe('validateRegisterForm', () => {
  it('returns no errors for a valid form', () => {
    expect(validateRegisterForm(validForm)).toEqual({});
  });

  it('flags every empty required field', () => {
    const errors = validateRegisterForm({
      fullName: '',
      email: '',
      gender: '',
      mobile: '',
      address: '',
      city: '',
      password: '',
      confirmPassword: '',
    });
    expect(Object.keys(errors).sort()).toEqual(
      ['address', 'city', 'confirmPassword', 'email', 'fullName', 'gender', 'mobile', 'password'].sort(),
    );
  });

  it('reports non-numeric and wrong-length mobile numbers separately', () => {
    expect(validateRegisterForm({ ...validForm, mobile: '98abc' }).mobile).toMatch(/digits only/);
    expect(validateRegisterForm({ ...validForm, mobile: '12345' }).mobile).toMatch(/exactly 10/);
  });

  it('enforces a 6 character minimum password', () => {
    const errors = validateRegisterForm({ ...validForm, password: '12345', confirmPassword: '12345' });
    expect(errors.password).toMatch(/at least 6/);
  });

  it('requires matching passwords', () => {
    const errors = validateRegisterForm({ ...validForm, confirmPassword: 'different' });
    expect(errors.confirmPassword).toBe('Passwords do not match');
  });
});

describe('validateLoginForm', () => {
  it('validates email format and required password', () => {
    expect(validateLoginForm('bad', '')).toEqual({
      email: 'Enter a valid email address',
      password: 'Password is required',
    });
    expect(validateLoginForm('a@b.co', 'x')).toEqual({});
  });
});

describe('validateProfileForm', () => {
  it('accepts a valid profile and rejects a bad mobile', () => {
    const profile = { fullName: 'A', gender: 'Male' as const, mobile: '9876543210', address: 'x', city: 'Pune' };
    expect(validateProfileForm(profile)).toEqual({});
    expect(validateProfileForm({ ...profile, mobile: '1' }).mobile).toBeDefined();
  });
});
