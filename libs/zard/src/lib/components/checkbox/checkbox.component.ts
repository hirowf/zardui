import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, forwardRef, input, output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClassValue } from 'class-variance-authority/dist/types';

import { checkboxLabelVariants, checkboxVariants, ZardCheckboxVariants } from './checkbox.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';

type OnTouchedType = () => any;
type OnChangeType = (value: any) => void;

@Component({
  selector: 'z-checkbox, [z-checkbox]',
  standalone: true,
  exportAs: 'zCheckbox',
  template: `
    <span class="flex items-center gap-2" [class]="disabled() ? 'cursor-not-allowed' : 'cursor-pointer'" (click)="onCheckboxChange()">
      <main class="flex relative">
        <input #input type="checkbox" [class]="classes()" [checked]="checked" [disabled]="disabled()" (blur)="onCheckboxBlur()" name="checkbox" />
        <i
          class="icon-check absolute flex items-center justify-center text-primary-foreground opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        ></i>
      </main>
      <label [class]="labelClasses()" for="checkbox">
        <ng-content></ng-content>
      </label>
    </span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardCheckboxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardCheckboxComponent implements ControlValueAccessor {
  readonly checkChange = output<boolean>();
  readonly class = input<ClassValue>('');
  readonly disabled = input(false, { transform });
  readonly zType = input<ZardCheckboxVariants['zType']>('default');
  readonly zSize = input<ZardCheckboxVariants['zSize']>('default');
  readonly zShape = input<ZardCheckboxVariants['zShape']>('default');
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onChange: OnChangeType = () => {};
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onTouched: OnTouchedType = () => {};

  protected readonly classes = computed(() => mergeClasses(checkboxVariants({ zType: this.zType(), zSize: this.zSize(), zShape: this.zShape() }), this.class()));
  protected readonly labelClasses = computed(() => mergeClasses(checkboxLabelVariants({ zSize: this.zSize() })));
  checked = false;

  constructor(private cdr: ChangeDetectorRef) {}

  writeValue(val: boolean): void {
    this.checked = val;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  onCheckboxBlur(): void {
    this.onTouched();
    this.cdr.markForCheck();
  }

  onCheckboxChange(): void {
    if (this.disabled()) return;

    this.checked = !this.checked;
    this.onChange(this.checked);
    this.checkChange.emit(this.checked);
    this.cdr.markForCheck();
  }
}
