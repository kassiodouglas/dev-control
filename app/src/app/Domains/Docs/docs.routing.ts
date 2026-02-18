import { Routes } from '@angular/router';
import { IndexPage } from './Pages/index/index.page';
import { ComponentsPage } from './Pages/components/components.page';
import { ServicesPage } from './Pages/services/services.page';
import { PlaygroundPage } from './Pages/playground/playground.page';
import { ModalPage } from './Pages/components/modal/modal.page';
import { PrimaryButtonPage } from './Pages/components/buttons/primary-button/primary-button.page';
import { InputFieldPage } from './Pages/components/form/input-field/input-field.page';
import { AllFieldsPage } from './Pages/components/form/all-fields/all-fields.page';
import { CardPage } from './Pages/components/card/card.page';
import { DocsLayout } from './Layouts/docs.layout';
import { BreadcrumbPage } from './Pages/components/breadcrumb/breadcrumb.page';
import { PageHeaderPage } from './Pages/components/page-header/page-header.page';
import { NotificationPage } from './Pages/services/notification/notification.page';
import { BlockPage } from './Pages/services/block/block.page';
import { LoadingPage } from './Pages/services/loading/loading.page';
import { PanelPage } from './Pages/panel/panel.page';

export const docsRoutes: Routes = [
    {
        path: '',
        component: DocsLayout,
        children: [
            {
                path: '',
                component: IndexPage,
                pathMatch: 'full'
            },
            {
                path: 'components',
                component: ComponentsPage
            },
            {
                path: 'components/modal',
                component: ModalPage
            },
            {
                path: 'components/buttons/primary-button',
                component: PrimaryButtonPage
            },
            {
                path: 'components/form/input-field',
                component: InputFieldPage
            },
            {
                path: 'components/form/all-fields',
                component: AllFieldsPage
            },
            {
                path: 'components/card',
                component: CardPage
            },
            {
                path: 'components/breadcrumb',
                component: BreadcrumbPage
            },
            {
                path: 'components/page-header',
                component: PageHeaderPage
            },
            {
              path: 'components/panel',
              component: PanelPage
          },
            {
                path: 'services',
                component: ServicesPage
            },
            {
                path: 'services/notification',
                component: NotificationPage
            },
            {
                path: 'services/block',
                component: BlockPage
            },
            {
                path: 'services/loading',
                component: LoadingPage
            },
            {
                path: 'playground',
                component: PlaygroundPage
            },
        ]
    }
];
