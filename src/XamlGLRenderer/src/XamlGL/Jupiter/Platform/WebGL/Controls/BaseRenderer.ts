﻿import { IControlRenderer } from "./../../IControlRenderer";
// import { Renderer } from "./../Renderer";
// import { VisualElementChangedEventArgs } from "./../../IFrameworkElementRenderer";
import { FrameworkElement } from "./../../../FrameworkElement";
import { IFrameworkElement } from "./../../../IFrameworkElement";
import { HorizontalAlignment } from "./../../../../DataTypes/HorizontalAlignment";
import { VerticalAlignment } from "./../../../../DataTypes/VerticalAlignment";
import { Point } from "./../../../../DataTypes/Point";
import { Panel } from "./../../../../Controls/Panel";
import { IEventArgs } from "./../../../../Events/IEventArgs";
import { IEvent } from "./../../../../Events/IEvent";
import { EventDispatcher } from "./../../../../Events/EventDispatcher";
import { ConsoleHelper } from "./../../../../utils/ConsoleHelper";
// import { Page } from "./../../../Page";
import { StackPanel } from "./../../../../Controls/StackPanel";
import { Orientation } from "./../../../../DataTypes/Orientation";

export class BaseRenderer implements IControlRenderer {

    // this is equvalent to the IVisualElementRenderer in xamarin, question is should
    // i introduce a clear separation between FrameworkElement & VisualElement or keep it
    // all in FrameworkElement (which is what im doing right now)
    // moto : keep it simple till you need the complexity

    private _element: FrameworkElement;
    private _elementChanged: EventDispatcher<BaseRenderer, IEventArgs> =
    new EventDispatcher<BaseRenderer, IEventArgs>();
    private _pixiElement: PIXI.DisplayObject;
    private _scale: number = 1;

    get Element(): FrameworkElement { return this._element; }
    get ElementChanged(): IEvent<BaseRenderer, IEventArgs> { return this._elementChanged; }
    get ParentWidth(): number {
        // if !(this._element.Parent instanceof Panel) {  }
        if (this._element.Parent !== null) {
            return this._element.Parent.Width === 0 ? this._element.Parent.CalculatedWidth : this._element.Parent.Width;
        }
        return null;
    }
    get ParentHeight(): number {
        if (this._element.Parent !== null) {
            return this._element.Parent.Height === 0 ? this._element.Parent.CalculatedHeight: this._element.Parent.Height;
        }
        return null;
    }
    get PixiElement(): PIXI.DisplayObject { return this._pixiElement; }
    get Scale(): number { return this._scale; }

    set Element(value: FrameworkElement) {
        this._element = value;
        this._element.Renderer = this;  // <-- HELP : this leads to a circular reference due to above lines reference

        // 1. set FrameworkElement propertychanged/focuschanged (VERenderer.SetElement)
        this._element.PropertyChanged.subscribe(this.OnPropertyChanged);
        this._element.FocusChanged.subscribe(this.OnFocusChanged);

        // 2. instantiate packager and do a Load
        //      ->  renderer.Element.ChildAdded
        //      ->  renderer.Element.ChildRemoved
        if (value instanceof Panel) {
            // consoleHelper.Log("BaseRenderer.Element : value was a panel");
            let castPanel: Panel = <Panel>this._element;
            castPanel.ChildAdded.subscribe(this.OnChildAdded);
            castPanel.ChildRemoved.subscribe(this.OnChildRemoved);
        } else {
            // consoleHelper.Log("BaseRenderer.Element : value was a native element");
        }

        // 3. call OnElementChanged


        //

    }
    set PixiElement(value: PIXI.DisplayObject) { this._pixiElement = value; }
    set Scale(value: number) { this._scale = value; }

    private OnPropertyChanged(): void {
        // todo
        ConsoleHelper.Log("Platform.OnPropertyChanged");
    }
    private OnFocusChanged(): void {
        // todo
        ConsoleHelper.Log("Platform.OnFocusChanged");
    }
    private OnChildAdded(): void {
        // todo
        ConsoleHelper.Log("Platform.OnChildAdded");
    }
    private OnChildRemoved(): void {
        // todo
        ConsoleHelper.Log("Platform.OnChildRemoved");
    }

    Draw(): void {
        // consoleHelper.Log("BaseRenderer.Draw");
    }


    public CalculateYHeight(backingControl: IFrameworkElement): void {
        if (backingControl.Height !== null && backingControl.Height > 0) {
            this.Element.CalculatedHeight = backingControl.Height;
            if (backingControl.VerticalAlignment === VerticalAlignment.Bottom) {
                this.Element.CalculatedY = this.ParentHeight - backingControl.Height;
            } else if (backingControl.VerticalAlignment === VerticalAlignment.Center) {
                this.Element.CalculatedY = (this.Element.Parent.CalculatedHeight - backingControl.Height) / 2;
            } else if (backingControl.VerticalAlignment === VerticalAlignment.Stretch) {
                this.Element.CalculatedHeight = this.ParentHeight;
                this.Element.CalculatedY = 0;
            } else if (backingControl.VerticalAlignment === VerticalAlignment.Top) {
                this.Element.CalculatedY = 0;
            }
        } else {
            if (backingControl.VerticalAlignment === VerticalAlignment.Stretch) {
                this.Element.CalculatedHeight = this.ParentHeight;
                this.Element.CalculatedY = 0;
            } else if (backingControl.VerticalAlignment === VerticalAlignment.Top) {
                this.Element.CalculatedY = 0;
            }
        }
    }

    public CalculateXWidth(backingControl: IFrameworkElement): void {
       if (backingControl.Width !== null && backingControl.Width > 0) {
           this.Element.CalculatedWidth = backingControl.Width;
           this.Element.CalculatedX = 0;
           if (backingControl.HorizontalAlignment === HorizontalAlignment.Left) {
               this.Element.CalculatedX = 0;
           } else if (backingControl.HorizontalAlignment === HorizontalAlignment.Right) {
               this.Element.CalculatedX = this.ParentWidth - backingControl.Width;
            } else if (backingControl.HorizontalAlignment === HorizontalAlignment.Stretch) {
               this.Element.CalculatedWidth = this.ParentWidth;
               this.Element.CalculatedX = this.ParentWidth - backingControl.Width;
            } else if (backingControl.HorizontalAlignment === HorizontalAlignment.Center) {
               this.Element.CalculatedX = (this.Element.Parent.CalculatedWidth - backingControl.Width) / 2;
            }
        } else {
           if (backingControl.HorizontalAlignment === HorizontalAlignment.Stretch) {
               this.Element.CalculatedWidth = this.ParentWidth;
               this.Element.CalculatedX = 0;
           } else if (backingControl.HorizontalAlignment === HorizontalAlignment.Left) {
               this.Element.CalculatedX = 0;
           }
        }
    }

    public UpdateCalculatedValuesUsingMargin(backingControl: IFrameworkElement): void {
       if (backingControl.Margin !== null || backingControl.Margin !== undefined) {
           if (backingControl.HorizontalAlignment === HorizontalAlignment.Left) {
               this.Element.CalculatedX += this.Element.Margin.Left;
           } else if (backingControl.HorizontalAlignment === HorizontalAlignment.Right) {
               this.Element.CalculatedX -= this.Element.Margin.Right;
           } else if (backingControl.HorizontalAlignment === HorizontalAlignment.Stretch) {
               this.Element.CalculatedX += this.Element.Margin.Left;
               this.Element.CalculatedWidth -= (this.Element.Margin.Right + this.Element.Margin.Left);
           } else if (backingControl.HorizontalAlignment === HorizontalAlignment.Center) {
               this.Element.CalculatedX += this.Element.Margin.Left;
               this.Element.CalculatedWidth -= (this.Element.Margin.Right + this.Element.Margin.Left);
           }

           if (backingControl.VerticalAlignment === VerticalAlignment.Top) {
               this.Element.CalculatedY += this.Element.Margin.Top;
           } else if (backingControl.VerticalAlignment === VerticalAlignment.Bottom) {
               this.Element.CalculatedY -= this.Element.Margin.Bottom;
           } else if (backingControl.VerticalAlignment === VerticalAlignment.Stretch) {
               this.Element.CalculatedY += this.Element.Margin.Top;
               this.Element.CalculatedHeight -= (this.Element.Margin.Top + this.Element.Margin.Bottom);
           } else if (backingControl.VerticalAlignment === VerticalAlignment.Center) {
               this.Element.CalculatedY += this.Element.Margin.Top;
           }
       }
   }

    public CalculateCurrentAvailableSlot(): Point {
        let parentXStart: number = 0;
        let parentYStart: number = 0;
        if (this.Element.Parent instanceof StackPanel) {
            // get from the parent stackpanel the next slot available to render in
            let sp: StackPanel = <StackPanel>this.Element.Parent;
            if (sp.Orientation === Orientation.Horizontal) {
                parentXStart += sp.CurrentItemRenderXY;
            } else {
                parentYStart += sp.CurrentItemRenderXY;
            }
        }
        return new Point(parentXStart, parentYStart);
    }

    public IncrementNextAvailableSlot(): void {
        // tell the parent stackpanel the next available slot
        if (this.Element.Parent instanceof StackPanel) {
            let sp: StackPanel = <StackPanel>this.Element.Parent;
            if (sp.Orientation === Orientation.Horizontal) {
                sp.CurrentItemRenderXY += this.Element.CalculatedWidth
                    + ((this.Element.Margin === undefined) ? 0 : (this.Element.Margin.Right + this.Element.Margin.Left));
            } else {
                sp.CurrentItemRenderXY += this.Element.CalculatedHeight
                    + ((this.Element.Margin === undefined) ? 0 : (this.Element.Margin.Top + this.Element.Margin.Bottom));
            }
        }
    }
}