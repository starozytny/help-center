<?php

namespace App\Security;

use App\Repository\Main\UserRepository;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class AccessTokenHandler implements AccessTokenHandlerInterface
{
    public function __construct(
        private readonly UserRepository $repository
    ) {
    }

    public function getUserBadgeFrom(string $accessToken): UserBadge
    {
        // e.g. query the "access token" database to search for this token
        $accessToken = $this->repository->findOneBy(['token' => $accessToken]);
        if (null === $accessToken) {
            throw new BadCredentialsException('Invalid credentials.');
        }

        // and return a UserBadge object containing the user identifier from the found token
        return new UserBadge($accessToken->getUserIdentifier());
    }
}
