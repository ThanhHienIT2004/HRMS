import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";
import {onError} from "@apollo/client/link/error";
import {getSession} from "next-auth/react";
import {setContext} from "@apollo/client/link/context";

const httpLink = new HttpLink({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL, // chú ý prefix
	credentials: "include",
});

const authLink = setContext(async (_, { headers }) => {
	const session = await getSession();
	const token = session?.user.accessToken;
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	}
})

const errorLink = onError(({graphQLErrors, networkError}) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({message, locations, path}) =>
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
			),
		);
	}
	if (networkError) console.log(`[Network error]: ${networkError}`);
})

export const apolloClient = new ApolloClient({
	link: authLink.concat(errorLink.concat(httpLink)),
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: "cache-and-network",
		},
		query: {
			fetchPolicy: "cache-only",
			errorPolicy: "all",
		}
	}
});
