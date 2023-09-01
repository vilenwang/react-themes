import 'focus-within-polyfill';

import './global/jquery-migrate';
import './common/select-option-plugin';
import PageManager from './page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import mobileMenuToggle from './global/mobile-menu-toggle';
import menu from './global/menu';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import privacyCookieNotification from './global/cookieNotification';
import adminBar from './global/adminBar';
import carousel from './common/carousel';
import loadingProgressBar from './global/loading-progress-bar';
import svgInjector from './global/svg-injector';
import { getproductCustomField, applyCreditNote } from './custom/api/creditnote';

export default class Global extends PageManager {
    onReady() {
        const {
            channelId, cartId, productId, categoryId, secureBaseUrl, maintenanceModeSettings, adminBarLanguage, showAdminBar,
        } = this.context;
        cartPreview(secureBaseUrl, cartId);
        quickSearch();
        currencySelector(cartId);
        foundation($(document));
        quickView(this.context);
        carousel(this.context);
        menu();
        mobileMenuToggle();
        privacyCookieNotification();
        if (showAdminBar) {
            adminBar(secureBaseUrl, channelId, maintenanceModeSettings, JSON.parse(adminBarLanguage), productId, categoryId);
        }
        loadingProgressBar();
        svgInjector();

        /* BundleB2B */
        const url = 'https://cdn.bundleb2b.net/dev/b3-auto-loader.js';
        //const url = 'http://127.0.0.1:8080/bundleb2b.latest.js'
        const el = document.createElement('script');
        el.setAttribute('src', url);
        document.querySelector('body').append(el);
        window.b3themeConfig = window.b3themeConfig || {};
        window.b3themeConfig.useJavaScript = {
            login: {
                callback(instance) {
                    window.sessionStorage.setItem('b2bToken', window.B3Storage.B3B2BToken.value)
                    $('.body').show();
                    const roleId = window.B3Storage.B3RoleId.value
                    if (roleId === '0') {
                        const creditNotesDom = `<li class="navBar-item ">
                            <a class="navBar-action" href="/creditnote-list/">Creditnote</a>
                        </li>`
                        $('.navBar-item__invoices').after(creditNotesDom)
                    }
                },
            },
            invoicespayment: {
                callback(instance) {
                    getOpenCriditNotes(instance)
                    instance.makeAPaymentBc = async (data) => {
                        const { openCriditNoteId } = instance
                        try {
                            window.B3Spinner.show()
                            const { data: { checkoutUrl, cartId } } = await instance.api.makeAPaymentBc({ ...data })
                            /**
                            * if success, add a localStorage field;
                            * when checkout, this fields is needed to do some customize requests
                            */
                            window.sessionStorage.setItem('cartId', cartId)
                            window.sessionStorage.setItem('openCriditNoteId', openCriditNoteId)
                            debugger
                            if (openCriditNoteId !== 'null') {
                                const res = await applyCreditNote(openCriditNoteId, { cart_id: cartId })
                                console.log(res, 'resadasdasd');
                            }
                            localStorage.setItem('IPCheckout', '1')
                            localStorage.setItem('IPCartId', cartId)
                           
                            window.location.replace(checkoutUrl)
                        } catch (e) {
                            instance.utils.Alert.error(e.errors)
                        } finally {
                            window.B3Spinner.hide()
                        }
                    }
                },
                beforeMount(instance) {

                },
            },
        };
        /* BundleB2B */
    }
}


const getOpenCriditNotes = async (instance) => {
    instance.openCriditNoteId = null
    const creditnotes = []
    const getcreditnoteLists = async () => {
        try {
            const { data } = await getproductCustomField(data)
            data.forEach((item) => {
                if (item.status === 1) {
                    creditnotes.push(item)
                }
            })
            const optionHtml = creditnotes.map(item => {
                return `<option value=${item.pk}>${item.currency_token + item.amount}</option>`
            })
            const creditnoteselete = `<select id='credit' style='width: 18%;
            margin-left: 850px;'>
                    <option value=null>select creaditnote</option>
                    ${optionHtml.toString().replace(/,/g, '')}
                    <select/>`
            $('.payment-table').after(creditnoteselete)
            document.querySelector('#credit').addEventListener('change', (e) => {
                instance.openCriditNoteId = e.target.value
                console.log(instance.openCriditNoteId, 'instance.openCriditNoteId');
            })
        } catch (error) {
        }
    }
    await getcreditnoteLists()
    return creditnotes
}