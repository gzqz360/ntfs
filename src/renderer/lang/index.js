
/*------------------------------------
*        导入vue和语言模块包
------------------------------------*/
import Vue from 'vue'
import VueI18n from 'vue-i18n'
// import ElementLocale from 'element-ui/lib/locale'




/*------------------------------------
*      vue组件上使用语言包
------------------------------------*/

Vue.use(VueI18n)

/*------------------------------------
*            导入语言包
------------------------------------*/

import zh_CN from './zh_CN'  //导入包
import zh_TW from './zh_TW'
import en_US from './en_US'




/*------------------------------------
*            设置语言配置
------------------------------------*/
// 默认语言（当前使用的语言）
var DEFAULT_LANG
DEFAULT_LANG = 'zh_CN'
if(localStorage.language){
    DEFAULT_LANG = localStorage.language // 默认语言（当前使用的语言）
}

const locales = {
    'zh_CN': zh_CN,
    'zh_TW': zh_TW,
    'en_US': en_US,
}

export const i18n = new VueI18n({

    locale: DEFAULT_LANG,// 语言标识//this.$i18n.locale // 通过切换locale的值来实现语言切换,当 locale 的值为"zh-CN"时，版本为中文；当 locale 的值为"en-US",版本为英文。
    messages: locales,
})
// ElementLocale.i18n((key, value) => i18n.t(key, value))//为了实现element插件的多语言切换




/*------------------------------------
*            设置语言配置
对外提供一个setup方法，用来修改我们的语言；
由于需要兼容多语言样式，所以这里在body上加入了相应的类名，方便我们做样式定制
------------------------------------*/
export const langSetup = lang => {
    // if (lang === undefined) {
    //     lang = window.localStorage.getItem(LOCALE_KEY)
    //     if (locales[lang] === undefined) {
    //         lang = DEFAULT_LANG
    //     }
    // }
    // // window.localStorage.setItem(LOCALE_KEY, lang)

    Object.keys(locales).forEach(lang => {
        document.body.classList.remove(`lang-${lang}`)
    })
    document.body.classList.add(`lang-${lang}`)
    document.body.setAttribute('lang', lang)
    //把当前语言设置到vue的配置里面，方便在代码中读取
    Vue.config.lang = lang
    i18n.locale = lang
}


//把i18n绑定到window上，方便在vue组件以外的文件使用语言包
window.i18n = i18n;

