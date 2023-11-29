<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class AdminLoginController extends AbstractController
{
    /**
     * @Route("/logadmin", name="log_admin")
     */
    public function logAdmin(Request $request, AuthenticationUtils $authenticationUtils)
    {

        // Récupère les erreurs d'authentification (le cas échéant)
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();
 
        // Rend la vue de la page de connexion avec les erreurs (le cas échéant)
        return $this->render('admin_login/login.html.twig', [
            'last_username' => $lastUsername,
            'error'         => $error,
        ]);
    }
}
