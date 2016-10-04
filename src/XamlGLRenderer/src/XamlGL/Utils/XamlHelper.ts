﻿import { XamlMarkup } from "./../Reader/XamlMarkup";
import { FrameworkElement } from "./../Jupiter/FrameworkElement";
import { Grid } from "./../Controls/Grid";
import { Image } from "./../Controls/Image";
import { Panel } from "./../Controls/Panel";
import { Rectangle } from "./../Controls/Rectangle";


export class XamlHelper {
    public static XamlMarkupToUIElement(xaml: XamlMarkup): FrameworkElement {

        let ret: FrameworkElement = this.ProcessHTMLElement(xaml.rootElement);
        // console.log("XamlHelper.XamlMarkupToUIElement");
        // console.log(ret);
        return ret;
    }

    private static ProcessCollection(col: HTMLCollection): FrameworkElement {
        for (let x: number = 0; x < col.length; x++) {
            let child: Element = col.item(x);
            return this.ProcessElement(child);
        }
    }
    private static ProcessCollectionNodes(rootPanel: Panel, col: NodeList): FrameworkElement {
        for (let x: number = 0; x < col.length; x++) {
            let node: Node = col.item(x);
            let newFE: FrameworkElement = this.ProcessNode(node);
            if (newFE !== null) {
                rootPanel.Children.add(newFE);
            }
        }
        return rootPanel;
    }
    private static ProcessNode(el: Node): FrameworkElement {
        let newFE: FrameworkElement = this.GetFrameworkElementByNode(el);
        if (newFE instanceof Panel) {
            return this.ProcessCollectionNodes(newFE, el.childNodes);
        }
        else {
            return newFE;
        }
    }
    private static ProcessElement(el: Element): FrameworkElement {
        let container: FrameworkElement = this.GetFrameworkElementByElement(el);

        if (container !== null && container instanceof Panel) {
            return this.ProcessCollectionNodes(<Panel>container, el.childNodes);
        }
    }
    private static ProcessHTMLElement(el: HTMLElement): FrameworkElement {
        return this.ProcessCollection(el.children);
    }
    private static GetFrameworkElementByElement(el: Element): FrameworkElement {
        console.log(el.nodeName);
        if (el.nodeName === "Grid") {
            let grid: Grid = new Grid();
            return grid;
        }
        return null;
    }

    private static GetFrameworkElementByNode(node: Node): FrameworkElement {
        // console.log("XamlHelper.GetFrameworkElementByNode : " + node.nodeName);
        if (node.nodeName === "Rectangle") {
            let rect: Rectangle = new Rectangle();
            rect.Width = Number.parseInt(node.attributes.getNamedItem("Width").value);
            rect.Height = Number.parseInt(node.attributes.getNamedItem("Height").value);
            rect.Background = "Red";
            return rect;
        } else if (node.nodeName === "Image") {
            let img: Image = new Image();
            img.Source = node.attributes.getNamedItem("Source").value;
            img.Width = Number.parseInt(node.attributes.getNamedItem("Width").value);
            img.Height = Number.parseInt(node.attributes.getNamedItem("Height").value);
            return img;
        } else if (node.nodeName === "Grid") {
            let grid: Grid = new Grid();
            return grid;
        }
        return null;
    }

}