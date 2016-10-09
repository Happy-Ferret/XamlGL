﻿import { IControlRenderer } from "./../../IControlRenderer";
import { BaseRenderer } from "./BaseRenderer";
// import { Renderer } from "./../Renderer";
// import { VisualElementChangedEventArgs } from "./../../IFrameworkElementRenderer";
// import { FrameworkElement } from "./../../../FrameworkElement";
// import { IEventArgs } from "./../../../../Events/IEventArgs";
// import { IEvent } from "./../../../../Events/IEvent";
// import { EventDispatcher } from "./../../../../Events/EventDispatcher";
import { ConsoleHelper } from "./../../../../utils/ConsoleHelper";
import { Image } from "./../../../../Controls/Image";
// import { StackPanel } from "./../../../../Controls/StackPanel";
// import { RendererHelper } from "./../../../../utils/RendererHelper";
// import { HorizontalAlignment } from "./../../../../DataTypes/HorizontalAlignment";
import { Point } from "./../../../../DataTypes/Point";
// import { Orientation } from "./../../../../DataTypes/Orientation";
// import { IRenderer } from "./../../IRenderer";
// import { IEventArgs } from "./../../../../Events/IEventArgs";

export class ImageRenderer extends BaseRenderer implements IControlRenderer {
    Draw(): void {
        super.Draw();
        ConsoleHelper.Log("ImagetRenderer.Draw");

        let imageEl: Image = <Image>super.Element;
        let parentContainer: PIXI.Container = <PIXI.Container>super.Element.Parent.Renderer.PixiElement;

        if (!imageEl.IsDirty) {
            return;
        }

        // calculate y position
        this.CalculateYHeight(imageEl);

        // calculate X position
        this.CalculateXWidth(imageEl);

        // take margin into account
        this.UpdateCalculatedValuesUsingMargin(imageEl);

        super.Element.Platform.Renderer.InitializeResource(imageEl.UniqueID, imageEl.SourceUrl)
            .load((loader: any, object: any) => {
                // determine container to use
                let parentXYStart: Point = this.CalculateCurrentAvailableSlot();
                // let parentXStart: number = 0;
                // let parentYStart: number = 0;

                // if (this.Element.Parent instanceof StackPanel) {
                //    // get from the parent stackpanel the next slot available to render in
                //    let sp: StackPanel = <StackPanel>this.Element.Parent;
                //    if (sp.Orientation === Orientation.Horizontal) {
                //        parentXStart += sp.CurrentItemRenderXY;
                //    } else {
                //        parentYStart += sp.CurrentItemRenderXY;
                //    }
                // }

                // render in the next available slot
                // let parentContainer: PIXI.Container = <PIXI.Container>super.Element.Parent.Renderer.PixiElement;
                super.Element.Platform.Renderer.ShowResource(
                    imageEl.UniqueID,
                    parentContainer,
                    super.Element.CalculatedX + parentXYStart.X,
                    super.Element.CalculatedY + parentXYStart.Y,
                    super.Element.CalculatedWidth,
                    super.Element.CalculatedHeight);

                this.IncrementNextAvailableSlot();
                // if (this.Element.Parent instanceof StackPanel) {
                //    // tell the parent stackpanel the next available slot
                //    let sp: StackPanel = <StackPanel>this.Element.Parent;
                //    if (sp.Orientation === Orientation.Horizontal) {
                //        sp.CurrentItemRenderXY += this.Element.CalculatedWidth
                //            + ((this.Element.Margin === undefined) ? 0: (this.Element.Margin.Right + this.Element.Margin.Left));
                //    } else {
                //        sp.CurrentItemRenderXY += this.Element.CalculatedHeight
                //            + ((this.Element.Margin === undefined) ? 0 : (this.Element.Margin.Top + this.Element.Margin.Bottom));
                //    }
                // }
                this.Element.Platform.Renderer.PixiRenderer.render(parentContainer);
            });

        // this.Element.Platform.Renderer.Render.subscribe((r: IRenderer, args: IEventArgs) => {
        //    // this.Element.Platform.Renderer.PixiRenderer.render(parentContainer);
        // });

        imageEl.IsDirty = false;
    }
}

// http://www.html5gamedevs.com/topic/10866-best-way-to-load-image-from-url/