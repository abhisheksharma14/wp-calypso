/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import page from 'page';
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import CartAd from './cart-ad';
import { cartItems } from 'lib/cart-values';
import { getSelectedSiteId } from 'state/ui/selectors';
import isDomainOnlySite from 'state/selectors/is-domain-only-site';
import { recordTracksEvent } from 'state/analytics/actions';
import { isPlan } from 'lib/products-values';
import { addItem } from 'lib/upgrades/actions';
import { PLAN_PREMIUM } from 'lib/plans/constants';

export class CartPlanAd extends Component {
	addToCartAndRedirect = event => {
		if ( event ) {
			event.preventDefault();
		}

		const domainRegistrations = cartItems.getDomainRegistrations( this.props.cart );
		const domainToBundle = get( domainRegistrations, '[0].meta', '' );

		this.props.recordTracksEvent( 'calypso_banner_cta_click', {
			cta_name: 'cart_domain_to_plan_upsell',
		} );

		addItem( cartItems.premiumPlan( PLAN_PREMIUM, { domainToBundle } ) );
		page( '/checkout/' + this.props.selectedSite.slug );
	};

	shouldDisplayAd = () => {
		const { cart, isDomainOnly, selectedSite } = this.props;
		const domainRegistrations = cartItems.getDomainRegistrations( cart );
		const isDomainPremium =
			domainRegistrations.length === 1 && get( domainRegistrations[ 0 ], 'extra.premium', false );
		const hasRenewalItem = cartItems.hasRenewalItem( cart );

		return (
			! isDomainOnly &&
			! hasRenewalItem &&
			cart.hasLoadedFromServer &&
			! cart.hasPendingServerUpdates &&
			! cartItems.hasDomainCredit( cart ) &&
			domainRegistrations.length === 1 &&
			! isDomainPremium &&
			selectedSite &&
			selectedSite.plan &&
			! isPlan( selectedSite.plan )
		);
	};

	render() {
		if ( ! this.shouldDisplayAd() ) {
			return null;
		}

		return (
			<CartAd>
				{ this.props.translate(
					'Get this domain free for one year when you upgrade to {{strong}}WordPress.com Premium{{/strong}}!',
					{
						components: { strong: <strong /> },
					}
				) }{' '}
				<Button onClick={ this.addToCartAndRedirect } borderless compact>
					{ this.props.translate( 'Upgrade Now' ) }
				</Button>
			</CartAd>
		);
	}
}

CartPlanAd.propTypes = {
	cart: PropTypes.object.isRequired,
	isDomainOnly: PropTypes.bool,
	selectedSite: PropTypes.oneOfType( [ PropTypes.bool, PropTypes.object ] ),
};

const mapStateToProps = state => {
	const selectedSiteId = getSelectedSiteId( state );

	return {
		isDomainOnly: isDomainOnlySite( state, selectedSiteId ),
	};
};

export default connect(
	mapStateToProps,
	{ recordTracksEvent }
)( localize( CartPlanAd ) );
