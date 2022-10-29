'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">@hsuite/angular-sdk documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/SmartNodeHashPackModule.html" data-type="entity-link" >SmartNodeHashPackModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SmartNodeHashPackModule-17b0b6a90ccd19c2acec30f41e70847a4fe2fa165e0db84d35fc9fd6e3ff5f53c76bd5a143aa39a673ad5aa3b6aacd22d441726162b4997be2537eab1767425e"' : 'data-target="#xs-injectables-links-module-SmartNodeHashPackModule-17b0b6a90ccd19c2acec30f41e70847a4fe2fa165e0db84d35fc9fd6e3ff5f53c76bd5a143aa39a673ad5aa3b6aacd22d441726162b4997be2537eab1767425e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SmartNodeHashPackModule-17b0b6a90ccd19c2acec30f41e70847a4fe2fa165e0db84d35fc9fd6e3ff5f53c76bd5a143aa39a673ad5aa3b6aacd22d441726162b4997be2537eab1767425e"' :
                                        'id="xs-injectables-links-module-SmartNodeHashPackModule-17b0b6a90ccd19c2acec30f41e70847a4fe2fa165e0db84d35fc9fd6e3ff5f53c76bd5a143aa39a673ad5aa3b6aacd22d441726162b4997be2537eab1767425e"' }>
                                        <li class="link">
                                            <a href="injectables/SmartNodeHashPackService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SmartNodeHashPackService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SmartNodeHederaModule.html" data-type="entity-link" >SmartNodeHederaModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SmartNodeHederaModule-613f65ce0e094aca60e84415298f86c739a29f7fc5f7ce734221f3018ee33101a3b5c3a3707986c6873f4f0f77ca4facf30899c341e7175bf88df0ec1b314821"' : 'data-target="#xs-injectables-links-module-SmartNodeHederaModule-613f65ce0e094aca60e84415298f86c739a29f7fc5f7ce734221f3018ee33101a3b5c3a3707986c6873f4f0f77ca4facf30899c341e7175bf88df0ec1b314821"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SmartNodeHederaModule-613f65ce0e094aca60e84415298f86c739a29f7fc5f7ce734221f3018ee33101a3b5c3a3707986c6873f4f0f77ca4facf30899c341e7175bf88df0ec1b314821"' :
                                        'id="xs-injectables-links-module-SmartNodeHederaModule-613f65ce0e094aca60e84415298f86c739a29f7fc5f7ce734221f3018ee33101a3b5c3a3707986c6873f4f0f77ca4facf30899c341e7175bf88df0ec1b314821"' }>
                                        <li class="link">
                                            <a href="injectables/SmartNodeHederaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SmartNodeHederaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SmartNodeNetworkModule.html" data-type="entity-link" >SmartNodeNetworkModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SmartNodeNetworkModule-e64b1578fe2d23110a6644f01bb02264ebacd115213ae9b2f4e0f4b8c632fb1816d04ce7e57b36038342fd8b0cd673d925a2c98c83ffc644525ac5cdb96b04cd"' : 'data-target="#xs-injectables-links-module-SmartNodeNetworkModule-e64b1578fe2d23110a6644f01bb02264ebacd115213ae9b2f4e0f4b8c632fb1816d04ce7e57b36038342fd8b0cd673d925a2c98c83ffc644525ac5cdb96b04cd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SmartNodeNetworkModule-e64b1578fe2d23110a6644f01bb02264ebacd115213ae9b2f4e0f4b8c632fb1816d04ce7e57b36038342fd8b0cd673d925a2c98c83ffc644525ac5cdb96b04cd"' :
                                        'id="xs-injectables-links-module-SmartNodeNetworkModule-e64b1578fe2d23110a6644f01bb02264ebacd115213ae9b2f4e0f4b8c632fb1816d04ce7e57b36038342fd8b0cd673d925a2c98c83ffc644525ac5cdb96b04cd"' }>
                                        <li class="link">
                                            <a href="injectables/SmartNodeNetworkService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SmartNodeNetworkService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SmartNodeRestModule.html" data-type="entity-link" >SmartNodeRestModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SmartNodeRestModule-e4321b48eed39feed8988067f5a32d6a8df1a7723beada97fd8788c005b8bd2731c7222f523f020c1055e061a150d0da7b586da92db005e836825c54a8f8a963"' : 'data-target="#xs-injectables-links-module-SmartNodeRestModule-e4321b48eed39feed8988067f5a32d6a8df1a7723beada97fd8788c005b8bd2731c7222f523f020c1055e061a150d0da7b586da92db005e836825c54a8f8a963"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SmartNodeRestModule-e4321b48eed39feed8988067f5a32d6a8df1a7723beada97fd8788c005b8bd2731c7222f523f020c1055e061a150d0da7b586da92db005e836825c54a8f8a963"' :
                                        'id="xs-injectables-links-module-SmartNodeRestModule-e4321b48eed39feed8988067f5a32d6a8df1a7723beada97fd8788c005b8bd2731c7222f523f020c1055e061a150d0da7b586da92db005e836825c54a8f8a963"' }>
                                        <li class="link">
                                            <a href="injectables/SmartNodeRestService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SmartNodeRestService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SmartNodeSdkModule.html" data-type="entity-link" >SmartNodeSdkModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SmartNodeSdkModule-66ca221e88ad7153e0f2cb4bbb042b633d47cbf62144f3bb003904c6bffc289a7344e4a8e12d92386a556209e8106e36e516917b3a3794a26d7e97efccf91f5b"' : 'data-target="#xs-injectables-links-module-SmartNodeSdkModule-66ca221e88ad7153e0f2cb4bbb042b633d47cbf62144f3bb003904c6bffc289a7344e4a8e12d92386a556209e8106e36e516917b3a3794a26d7e97efccf91f5b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SmartNodeSdkModule-66ca221e88ad7153e0f2cb4bbb042b633d47cbf62144f3bb003904c6bffc289a7344e4a8e12d92386a556209e8106e36e516917b3a3794a26d7e97efccf91f5b"' :
                                        'id="xs-injectables-links-module-SmartNodeSdkModule-66ca221e88ad7153e0f2cb4bbb042b633d47cbf62144f3bb003904c6bffc289a7344e4a8e12d92386a556209e8106e36e516917b3a3794a26d7e97efccf91f5b"' }>
                                        <li class="link">
                                            <a href="injectables/SmartNodeSdkService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SmartNodeSdkService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SmartNodeSocketsModule.html" data-type="entity-link" >SmartNodeSocketsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SmartNodeSocketsModule-2834488c038426fa068d4bd9c25557a26e768f19fae975441c5af6cf54b5684c3f8a41b81a337c07ef210d3df962c01a62f7d180fff90fd0dc717e371962fa7b"' : 'data-target="#xs-injectables-links-module-SmartNodeSocketsModule-2834488c038426fa068d4bd9c25557a26e768f19fae975441c5af6cf54b5684c3f8a41b81a337c07ef210d3df962c01a62f7d180fff90fd0dc717e371962fa7b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SmartNodeSocketsModule-2834488c038426fa068d4bd9c25557a26e768f19fae975441c5af6cf54b5684c3f8a41b81a337c07ef210d3df962c01a62f7d180fff90fd0dc717e371962fa7b"' :
                                        'id="xs-injectables-links-module-SmartNodeSocketsModule-2834488c038426fa068d4bd9c25557a26e768f19fae975441c5af6cf54b5684c3f8a41b81a337c07ef210d3df962c01a62f7d180fff90fd0dc717e371962fa7b"' }>
                                        <li class="link">
                                            <a href="injectables/SmartNodeSocketsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SmartNodeSocketsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/SmartNodeSocket.html" data-type="entity-link" >SmartNodeSocket</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Node.html" data-type="entity-link" >Node</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});